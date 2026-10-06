async function getHead(username: string){
    const response = await fetch("https://mc-heads.net/avatar/"+username);
    return response.url;
}
async function exportHead(username: string){
    const head = await getHead(username);
    return head;
}

module.exports = {getHead};