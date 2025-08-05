interface InputErrorMessageProps {
    message?: string;
}
export function InputErrorMessage({ message }: InputErrorMessageProps){
    return <p className="text-xs text-red-500">{message}</p>
}