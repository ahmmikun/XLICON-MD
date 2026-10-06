function formatMemeText(text) {
    if (!text || text.trim() === '') return '_';
    return text
        .trim()
        .replace(/_/g, '__')
        .replace(/-/g, '--')
        .replace(/ /g, '_')
        .replace(/\?/g, '~q')
        .replace(/%/g, '~p')
        .replace(/#/g, '~h')
        .replace(/\//g, '~s');
}
module.exports = {
    formatMemeText,
};
