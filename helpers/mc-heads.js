async function getHead(username){
    const response = await fetch("https://mc-heads.net/avatar/"+username);
    return response.url;
}
async function exportHead(username){
    const head = await getHead(username);
    return head;
}

module.exports = {getHead};