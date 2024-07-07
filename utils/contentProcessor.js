const stopChars = ['.', '!', '?', '”', '”', ')', ']'];

function processContent(content) {
    let words = content.split(' ');

    // If the content has less than 35 words, return it directly
    if (words.length <= 35) {
        return content;
    }

    let trimmedContent = words.slice(0, 35).join(' ');

    // Extend to the next stop character
    for (let i = 35; i < Math.min(80, words.length); i++) {
        trimmedContent += ' ' + words[i];
        if (stopChars.includes(trimmedContent.trim().slice(-1))) {
            break;
        }
    }

    // Ensure it doesn't exceed 100 words
    let finalWords = trimmedContent.split(' ');
    if (finalWords.length > 80) {
        trimmedContent = finalWords.slice(0, 80).join(' ') + '.';
    }

    return trimmedContent;
}

module.exports = processContent;
