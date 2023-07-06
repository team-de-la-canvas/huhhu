import {MessageType, showMessage} from "react-native-flash-message";


const flash = (message:string, description: string,  type: MessageType) => {
    showMessage({
        message: JSON.stringify(message),
        description: JSON.stringify(description),
        type,
    });
}
const flashError = (message:string, description?: string) => {
    console.error(message,description);
    flash(message, description, "danger");
}
const flashWarning = (message:string, description?: string) => {
    console.warn(message,description)
    flash(message, description, "warning")
};
const flashSuccess = (message:string, description?: string) => {
    console.log(message,description)
    flash(message, description, "success")
};



export {flashError, flashWarning, flashSuccess}