const validate = (...inputs: {target: string; value: string, min?: number, max?: number}[]) => {
    const inputArr = [...inputs];

    const messages : { target: string, msgs?: string[]; sanitizedValue?: string }[] = []
    
    for(let i = 0; i < inputArr.length; i++) {
        const obj = inputArr[i];

        if(obj.min && obj.value.trim().length < obj.min) {
            const existing = messages.findIndex(t => t.target === obj.target);
            if(existing === -1) {
                messages.push({ target: obj.target, msgs: [`${obj.target} must have a min length of ${obj.min}`] });
            } else {
                const currentTarget = messages[existing];
                const newObj = { target: currentTarget.target, msgs: [ ...currentTarget.msgs as string[], `${obj.target} must have a min length of ${obj.min}` ] };
                messages[existing] = newObj;
            }
        }

        if(obj.max && obj.value.trim().length > obj.max) {
            const existing = messages.findIndex(t => t.target === obj.target);
            if(existing === -1) {
                messages.push({ target: obj.target, msgs: [`${obj.target} has a max length of ${obj.max}`] });
            } else {
                const currentTarget = messages[existing];
                const newObj = { target: currentTarget.target, msgs: [ ...currentTarget.msgs as string[], `${obj.target} must has a max length of ${obj.max}` ] };
                messages[existing] = newObj;
            }
        }
        
        if(obj.target.toLowerCase() !== 'email') {
            const existing = messages.findIndex(t => t.target === obj.target);
            if(existing === -1) {
                messages.push({ target: obj.target, sanitizedValue: obj.value.trim() });
            } else {
                const currentTarget = messages[existing] as { target: string; sanitizedValue: string; msgs: string[] };
                if(currentTarget.msgs.length > 0) {
                    continue;
                }
                const newObj = { target: messages[existing].target, sanitizedValue: obj.value.trim() };
                messages[existing] = newObj;
                continue;
            }
        }
        
        if(obj.target.toLowerCase() === 'email') {
            const existing = messages.findIndex(t => t.target === obj.target);
            if(!obj.value.includes('@')) {
                if(existing === -1) {
                    messages.push({ target: obj.target, msgs: [`${obj.target} must include an @ symbol`] });
                    continue;
                }
                const currentTarget = messages[existing];
                const newObj = { target: currentTarget.target, msgs: [ ...currentTarget.msgs as string[], `${obj.target} must include an @ symbol` ] };
                messages[existing] = newObj;
                continue;
            }
            if(existing === -1) {
                messages.push({ target: obj.target, sanitizedValue: obj.value.trim() });
                continue;
            }
            const newObj = { target: messages[existing].target, sanitizedValue: obj.value.trim() };
            messages[existing] = newObj;
            continue;
        }
    }
    return messages;

}

export default validate;