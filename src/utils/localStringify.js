export default function localStringify(url, params) { 
        let result = '';
        for (const k of Object.keys(params)) {
            const v = params[k];
            const p = encodeURIComponent(k) + '='
            if (v !== null && v !== '' && typeof (v) !== 'undefined') {
                if (typeof(v) === 'object') {
                    for (const key of Object.keys(v)) {
                        if (v[key] !== null && v[key] !== '' && typeof (v[key]) !== 'undefined') {
                            const sp = k + '[' + key + ']'
                            const subPart = encodeURIComponent(sp) + '='
                            result += subPart + encodeURIComponent(v[key]) + '&'
                        }
                    }
                } else {
                    result += p + encodeURIComponent(v) + '&'
                }
            }
        }
        return url + '?' + result;
}