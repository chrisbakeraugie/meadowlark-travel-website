//this array of fortunes is being used to explain dynamic information
const fortuneCookies = [
    "Conquer your fears or they will conquer you",
    "Rivers need springs",
    "Do not fear what you don't know",
    "You will have a pleasant suprise",
    "Whenever possible, keep it simple",
    "Epstein didn't kill himself"
]

exports.getFortune = () => {
    const index = Math.floor(Math.random()*fortuneCookies.length)
    return fortuneCookies[index]
}