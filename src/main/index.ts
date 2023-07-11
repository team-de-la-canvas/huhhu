import express, {NextFunction, Request, Response} from 'express';
import cors from 'cors';
import {
    ClientsRequest,
    ClientsResponse,
    VisibleRequest,
    VisibleResponse,
    MatchesRequest,
    MatchesResponse,
    MatchRequest,
    MatchResponse,
    RegistrationRequest,
    RegistrationResponse,
    SetLocationRequest,
    SetLocationResponse,
    InvisibleRequest,
    InvisibleResponse,
    CancelMatchRequest, CancelMatchResponse, GetLocationOfMatchRequest, GetLocationOfMatchResponse
} from "../shared/routes";
import {Client} from "../shared/models";
import {randomUUID} from "crypto";





// ******************** Declarations ***********************//

declare global {
    namespace Express {
        interface Response {
            handleResponse: <ResponseType>(args: ResponseHandlerArgs<ResponseType>) => void;
        }
    }
}
interface AuthenticatedRequest {
    clientCode: number
}
class AuthError extends Error {
    clientCode: string;

    constructor(message: string, clientCode: string) {
        super(message);
        this.clientCode = clientCode;
        // Set the prototype explicitly to maintain the inheritance chain
        Object.setPrototypeOf(this, AuthError.prototype);
    }
}

type ResponseHandlerArgs<ResponseType> = {
    payload: ResponseType;
    statusCode: number;
};



// ******************** Global state ***********************//



const debug = process.env["debug"]==="true";



let clients: Client[]  = [];


const app = express();
const port = 3000;


// Define the allowed origin
const allowedOrigins = ['https://tome.app','https://web.huhhu.app','https://localhost:19006'];

// Configure CORS options
const corsOptions = {
    origin: function (origin, callback) {
        // Check if the origin is allowed or is undefined (for non-browser requests)
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};



// ******************** Pre Middleware ***********************//

app.use(cors(corsOptions));
app.use(express.json());


const handleResponseWrapper = <ResponseType>(res: Response, args: ResponseHandlerArgs<ResponseType>) => {
    const { payload, statusCode } = args;
    let actualPayload = payload;
    if (debug)
        actualPayload = {...payload,state:clients};
    res.status(statusCode).send(actualPayload);
};

app.use((req: Request, res: Response, next: NextFunction) => {
    res.handleResponse = (args) => handleResponseWrapper(res, args);
    next();
});





// ******************** Utilities ***********************//



const authenticate = (req: Request<AuthenticatedRequest>): Client => {
    const clientCode = req.body.clientCode;
    const client = clients.find(client => client.code===clientCode);
    if (!client){
        throw new AuthError("authentication failed", clientCode);
    }
    return client;
}



// ******************** Routes ***********************//


// returns on successful login a code for which is used to authenticate clients for future requests
app.post("/reg", (req: Request<RegistrationRequest>, res: Response<RegistrationResponse | string>) => {
    const clientName = req.body.clientName;
    if (!clientName || clients.find(cl => cl.name === clientName)) {
        res.handleResponse({
            payload: {
                message: "Error registering under this clientName. Potentially already registered."
            },
            statusCode: 400
        });
        return;
    }
    const code = Math.floor(Math.random() * 10000);
    clients.push({name: clientName, code: code, location: undefined});
    
    res.handleResponse({
        payload: {clientCode: code},
        statusCode: 200
    })
})

app.post("/visible", (req: Request<VisibleRequest>, res: Response<VisibleResponse>) => {
    const client = authenticate(req);
    client.visible = true;

    res.handleResponse({
        payload: {
            message: "visibility activated!"
        },
        statusCode: 200
    });
});
const cancelMatch = (client:Client) => {
    if (!client.activeMatchWith)
        return;
    const match = clients.find(x=>x.name ===client.activeMatchWith)
    console.log("Match:",match)
    if (!match) //match already disappeared
        return;
    
    client.activeMatchWith = undefined;
    match.activeMatchWith = undefined;
    match.piggyBack = {
        id: randomUUID(),
        type: "matchCanceled",
        payload: {
            message: "match has stopped"
        }
    }
}
app.post("/invisible", (req: Request<InvisibleRequest>, res: Response<InvisibleResponse>) => {
    const client = authenticate(req);

    console.log("Client:",client)

    cancelMatch(client);

    console.log("Canceled Match:",clients)

    client.visible = false;

    res.handleResponse({
        payload: {
            message: "visibility activated!"
        },
        statusCode: 200
    });
});


app.post("/match", (req: Request<MatchRequest>, res: Response<MatchResponse>) => { //the client that wants to match with randomly chosen other client needs to provide their own code for authorization.
    const thisClient = authenticate(req);
    if (!thisClient.visible){
        res.handleResponse({
            statusCode: 400,
            payload:{
                message: "You need to be visible, in order to match"
            }
        });
        return;
    }
    
    const otherClient = clients.find(cl => cl.visible && cl.code !== thisClient.code && cl.activeMatchWith === undefined);
    
    if (!otherClient){
        res.handleResponse({
            statusCode: 404,
            payload:{
                message: "No match available"
            }
        });
        return;
    }

    if (thisClient.name !== otherClient.name) {
        thisClient.activeMatchWith = otherClient.name;
        otherClient.activeMatchWith = thisClient.name;
        
        otherClient.piggyBack = {
            id: randomUUID(),
            type: "matchStarted",
            payload: {
                matchName: thisClient.name,
                message: "match has started"
            }
        }
        
        res.handleResponse({
            payload: {
                matchName: otherClient.name,
                message: `successfully matched with other client: ${otherClient.name}`,
            },
            statusCode: 200
        });
        
    } else {
        res.handleResponse({
            payload: {
                message: "client mismatch", 
                matchName: undefined
            },
            statusCode: 400
        });
    }
})

app.post("/cancelMatch", (req: Request<CancelMatchRequest>, res: Response<CancelMatchResponse>) => {
    const client = authenticate(req)
    const match = clients.find(cl=>cl.name === client.activeMatchWith);
    if (!match){
        res.handleResponse({
            payload: {
                message: "You cannot cancel a match, that doesnt exist!",
                matchName: undefined
            },
            statusCode: 400
        });
        return;
    }
    
    cancelMatch(client);
})

app.get("/clients", (req: Request<ClientsRequest>, res:Response<ClientsResponse>) => {
    const authenticatedClients = clients.filter(cl => cl.visible).map(cl => cl.name);
    res.handleResponse({
        payload: {
            clients: authenticatedClients
        },
        statusCode: 200
    });
});

const matchesGrouping = (result:string[][], item) => {
    if (item.activeMatchWith) {
        // Überprüfe, ob das Paar schon im result-Array existiert
        if (!result.some(pair => pair.includes(item.name) && pair.includes(item.activeMatchWith))) {
            // Wenn nicht, fuege das Paar hinzu
            result.push([item.name, item.activeMatchWith].sort());
        }
    }
    return result;
}

app.get("/matches", (req: Request<MatchesRequest>,res:Response<MatchesResponse>) => {
    const matches = clients.reduce(matchesGrouping, [])
    
    res.handleResponse({
        payload: {
            matches: matches
        },
        statusCode: 200
    });
})


app.post("/setLocation", (req: Request<SetLocationRequest>, res: Response<SetLocationResponse>) => { 
    const client = authenticate(req)

    const newLocation = req.body.clientLocation; 
    client.location =newLocation; 
    res.handleResponse({
        payload: {
            clientLocation: newLocation,
            piggyBack: client.piggyBack
        },
        statusCode: 200
    });
    
})


app.post("/getLocationOfMatch", (req: Request<GetLocationOfMatchRequest>, res: Response<GetLocationOfMatchResponse>) => {
    const client = authenticate(req);
    if (!client.visible){
        res.handleResponse({
            statusCode: 400,
            payload:{
                message: "You need to be visible in order to get the location of your match"
            }
        });
        return;
    }
    
    
    const otherClient = clients.find(cl => cl.visible && cl.activeMatchWith === client.name);
    
    if (!otherClient || otherClient.location === undefined){
        res.handleResponse({
            statusCode: 404,
            payload:{
                message: "No location found"
            }
        });
        return;
    }
    
    res.handleResponse({
        payload: {
            clientLocation:otherClient.location
        },
        statusCode: 200
    })
})

app.post("/debugSetState", (req : Request<Client[]>, res : Response<Client[]>) => {
    clients = req.body;
    res.handleResponse({
        payload:req.body,
        statusCode: 200
    })
});


// ******************** Post Middleware ***********************//


app.use((err, req: Request, res: Response, next: NextFunction) => {
    if (!err) return next();
    if (err instanceof AuthError) {
        res.status(403).json({ error: `Authentication failed with clientCode: ${err.clientCode}` });
    } else {
        res.status(500).json({ error: `Internal Server Error: ${err.message}` });
    }
});



// ******************** Main LOOP ***********************//



app.listen(port, '0.0.0.0', () => {
    console.log(`App listening at http://0.0.0.0:${port}`);
});
