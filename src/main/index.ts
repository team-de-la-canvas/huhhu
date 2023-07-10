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

const debug = process.env["debug"]==="true";


const app = express();
const port = 3000;


type ResponseHandlerArgs<ResponseType> = {
    payload: ResponseType;
    statusCode: number;
};

const handleResponseWrapper = <ResponseType>(res: Response, args: ResponseHandlerArgs<ResponseType>) => {
    const { payload, statusCode } = args;
    const previousState = JSON.parse(JSON.stringify(clients));
    let actualPayload = payload;
    if (debug)
        actualPayload = {...payload,state:previousState};
    res.status(statusCode).send(actualPayload);
    console.log({
        action: args,
        statePreExecution: previousState,
        statePostExecution: clients
    });
};


declare global {
    namespace Express {
        interface Response {
            handleResponse: <ResponseType>(args: ResponseHandlerArgs<ResponseType>) => void;
        }
    }
}

app.use(cors());
app.use(express.json());

// Middleware to extend the Response object prototype
app.use((req: Request, res: Response, next: NextFunction) => {
    res.handleResponse = (args) => handleResponseWrapper(res, args);
    next();
});

// Custom middleware to handle exceptions
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    // Handle the error and send a response to the client
    if (err instanceof AuthError) {
        res.status(403).json({ error: `Authentication failed with clientCode: ${err.clientCode}` });
        next();
        return;
    }
    res.status(500).json({ error: 'Internal Server Error' });
    next();
});




let clients: Client[]  = [];
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

const authenticate = (req: Request<AuthenticatedRequest>): Client => {
    const clientCode = req.body.clientCode;
    const client = clients.find(client => client.code===clientCode);
    if (!client){
        throw new AuthError("authentication failed", clientCode);
    }
    return client;
} 

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

app.post("/invisible", (req: Request<InvisibleRequest>, res: Response<InvisibleResponse>) => {
    const client = authenticate(req);
    client.visible = false;

    cancelMatch(client);

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
            statusCode: 500,
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
                matchName: thisClient.name
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

app.listen(port, '0.0.0.0', () => {
    console.log(`App listening at http://0.0.0.0:${port}`);
});
