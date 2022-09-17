import {useEffect, useRef} from 'react'

// using useRef to prevent from rendering twice
export function useWatch (callback: Function, args: any[]):void {
    
    const effectRan = useRef(false)
    useEffect(() => {
        if (!effectRan.current) {
            effectRan.current = true
            return
        }
        callback()
    }, args)
}