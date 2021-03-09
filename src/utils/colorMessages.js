//some fun messages the bot can say when applying people's color roles

//messages for a regular color allocation
const stdColor = [
    'Nice one!',
    'That looks good on you!',
    'Oh, that\'s nice.',
    'Looks good.',
    'Lookin\' good.',
    'Nice choice!',
    'Good choice!',
    'I like that one.',
    'Great taste!',
]

//messages for when you get a color from someone else
const usrColor = [
    'Yoink!',
    'Yeah, that\'s a good one.',
    'That\'s a nice one.',
    'Joining the club!',
    'Sharing is caring!',
    'They\'ve got a good one there.'
]

module.exports = {
    //gets a random std message
    getStdMessage: () => {
        return stdColor[Math.floor(Math.random() * stdColor.length)];
    },
    getUsrMessage: () => {
        return usrColor[Math.floor(Math.random() * usrColor.length)];
    }
}