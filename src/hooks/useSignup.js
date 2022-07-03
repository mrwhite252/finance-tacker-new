import {
    useEffect,
    useState
} from "react"
import {
    projectAuth
} from '../firebase/config'
import {
    useAuthContext
} from "./useAuthContext"


export const useSignup = () => {

    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const {
        dispatch
    } = useAuthContext()

    // clean up function
    const [isCancelled, setIsCancelled] = useState(false);

    const signup = async (email, password, displayName) => {

        setError(null);
        setIsPending(true)

        try {
            // signup user
            const res = await projectAuth.createUserWithEmailAndPassword(email, password)

            // console.log(res.user)

            if (!res) {
                throw new Error('could not complete signup');
            }

            // add display name to user
            await res.user.updateProfile({
                displayName: displayName
            })

            // dispatch login action
            dispatch({
                type: 'LOGIN',
                payload: res.user
            })

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

    return {
        error,
        isPending,
        signup
    }
}