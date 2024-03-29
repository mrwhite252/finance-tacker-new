import {
    useReducer,
    useEffect,
    useState
} from "react";
import {
    projectFirestore,
    timestamp
} from "../firebase/config";


let initialState = {
    document: null,
    isPending: false,
    error: null,
    success: null
}

const firestoreReducer = (state, action) => {
    switch (action.type) {
        case 'IS_PENDING':
            return {
                isPending: true, document: null, success: false, error: null
            }
            case 'ADDED_DOCUMENT':
                return {
                    isPending: false, document: action.payload, success: true, error: null
                }
                case 'DELETED_DOCUMENT':
                    return {
                        isPending: false, document: null, success: true, error: null
                    }
                    case 'ERROR':
                        return {
                            isPending: false, document: null, success: false, error: action.payload
                        }


                        default:
                            return state
    }
}

export const useFirestore = (collection) => {

    const [response, disptach] = useReducer(firestoreReducer, initialState)
    const [isCancelled, setIsCancelled] = useState(false)

    // collection ref

    const ref = projectFirestore.collection(collection)

    // only dispatch is not cancelled

    const dispatchIFNotCancelled = (action) => {
        if (!isCancelled) {
            disptach(action)
        }

    }

    // add a document

    const addDocument = async (doc) => {
        disptach({
            type: 'IS_PENDING'
        })
        try {
            const createdAt = timestamp.fromDate(new Date())
            const addedDocument = await ref.add({
                ...doc,
                createdAt
            })
            dispatchIFNotCancelled({
                type: 'ADDED_DOCUMENT',
                payload: addedDocument
            })


        } catch (err) {
            console.log(err.message)
            dispatchIFNotCancelled({
                type: 'ERROR',
                payload: err.message
            })
        }
    }

    // delete a document
    const deleteDocument = async (id) => {
        disptach({
            type: 'IS_PENDING'
        })

        try {

            await ref.doc(id).delete()
            dispatchIFNotCancelled({
                type: 'DELETED_DOCUMENT'
            })

        } catch (err) {
            dispatchIFNotCancelled({
                type: 'ERROR',
                payload: "Could not delete"
            })

        }


    }

    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])

    return {
        addDocument,
        deleteDocument,
        response
    }
}