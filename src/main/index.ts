import express, {NextFunction, Request, Response} from 'express';
import cors from 'cors';
import {
    ClientsRequest,
    ClientsResponse,
    VisibleRequest,
    VisibleResponse, MatchesRequest, MatchesResponse,
    MatchRequest, MatchResponse,
    RegistrationRequest,
    RegistrationResponse, SetLocationRequest, SetLocationResponse, InvisibleRequest, InvisibleResponse
} from "../shared/routes";
import {Client} from "../shared/models";
import { v4 as uuid } from "uuid"
import {randomUUID} from "crypto";


const app = express();
const port = 3000;


type ResponseHandlerArgs<ResponseType> = {
    payload: ResponseType;
    statusCode: number;
};

const handleResponseWrapper = <ResponseType>(res: Response, args: ResponseHandlerArgs<ResponseType>) => {
    const { payload, statusCode } = args;
    const previousState = JSON.parse(JSON.stringify(clients));
    res.status(statusCode).send(payload);
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
    res.status(500).json({ error: 'Internal Server Error' });
    next();
});




let clients: Client[]  = [];

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
    const clientCode = req.body.clientCode;

    const options = clients.filter(client => client.code===clientCode);
    if (options.length !== 1){
        res.handleResponse({
            payload: {
                message:"error, wrong code"
            },
            statusCode: 400
        })
        return;
    }
    const client = options[0];
    client.visible = true;

    res.handleResponse({
        payload: {
            message: "visibility activated!"
        },
        statusCode: 200
    });
});

app.post("/invisible", (req: Request<InvisibleRequest>, res: Response<InvisibleResponse>) => {
    const clientCode = req.body.clientCode;

    const options = clients.filter(client => client.code===clientCode);
    if (options.length !== 1){
        res.handleResponse({
            payload: {
                message:"error, wrong code"
            },
            statusCode: 400
        })
        return;
    }
    const client = options[0];
    client.visible = false;

    res.handleResponse({
        payload: {
            message: "visibility activated!"
        },
        statusCode: 200
    });
});


app.post("/match", (req: Request<MatchRequest>, res: Response<MatchResponse>) => { //the client that wants to match with randomly chosen other client needs to provide their own code for authorization.
    const clientCode = req.body.clientCode;
    const otherClient = clients.find(cl => cl.visible && !cl.code !== clientCode);
    const thisClient = clients.find(cl => cl.visible && cl.code === clientCode);
    
    if (!otherClient){
        res.handleResponse({
            statusCode: 500,
            payload:{
                message: "No match available"
            }
        });
        return;
    }

    if (thisClient && otherClient && thisClient.name !== otherClient.name) {
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
    const clientCode = req.body.clientCode;
    const thisClient = clients.find(cl => cl.code === clientCode);
    if (thisClient)
    {
        res.handleResponse({
            payload: {
                clientLocation: req.body.clientLocation,
                piggyBack: thisClient.piggyBack
            },
            statusCode: 200
        });
    } else {
        res.handleResponse({
            payload: {
                message: "Client not registered yet"
            },
            statusCode: 400
        });
    }
    
})


app.post("/getLocationOfMatch", (req, res) => {
    const clientCode = req.body.clientCode;
    const thisClient = clients.find(cl => cl.visible && cl.code === clientCode);
    console.log("this client: ",thisClient)
    const otherClient = clients.find(cl => cl.visible && cl.activeMatchWith === thisClient.name);
    console.log("other client: ",otherClient)
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
