async function getApod(date) {
    const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
    const params = {api_key: apiKey};
 
    if(date) {
        params.date = date;
    }
 
    try {
        const response = await axios.get('https://api.nasa.gov/planetry/apod')
         ({
            params,
            timeout:5000
        });
 
        return response.data;
    }   catch (error) {
        if (error.code === 'ECONNABORTED') {
        throw { status: 504,erro: 'Gateay Timeout', mensagem:'A NASA nao respondeu dentro do tempo limite.'}
    }
 
    if (error.response) {
        const status = error.response.status;
        if (status === 400 || status === 429) {
            throw {status:400, erro: 'Bad Request', mensagem: 'Data em formato invalido ou data rejeitada pela NASA.'}
        }
        throw {status:502, erro: 'Bad Gateway', mensagem: 'Falha ou resposta inesperada da NASA.'}
    }
    throw {status: 502, erro: 'Bad Gateway', mensagem: 'Erro de conexao com a API externa.'};
}
}
 
 
export {getApod}
 