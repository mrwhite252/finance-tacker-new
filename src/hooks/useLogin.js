import { useEffect, useState } from "react"
import { projectAuth } from '../firebase/config'
import { useAuthContext } from "./useAuthContext"

export const useLogin = () => {
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()

    // clean up function
    const [isCancelled, setIsCancelled] = useState(false);

    const login = async (email, password) => {

        setError(null);
        setIsPending(true)

        // sign the user in

        try {
            const res = await projectAuth.signInWithEmailAndPassword(email, password)

            // disptach login action
            dispatch({ type: 'LOGIN', payload: res.user });

            // update state
            if (!isCancelled) {
                setIsPending(false);
                setError(null);
            }

        } catch (err) {
            if (!isCancelled) {
                console.log(err.message);
                setError(err.message);
                setIsPending(false);
            }
        }
    }

    //clean up function
    useEffect(() => {
        return () => setIsCancelled(true);
    }, [])

    return { login, error, isPending }
}