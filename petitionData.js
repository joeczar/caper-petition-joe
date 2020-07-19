module.exports.headerTitle = {
    headline: 'Switch to Open Source Software',
    subText: [
        'Say no to surveillance capitalism!',
        'Say yes to privacy!',
        'Say yes to open source, not for profit software!',
    ],
};
module.exports.petitionReason =
    'Say no to surveillance capitalism, protect your privacy and yes to open source, not for profit software!';
module.exports.slides = [
    {
        id: 'one',
        class: 'light',
        next: '#two',
        headline:
            'Does your school or workplace use communication software that is secure?',
        url:
            'https://www.forbes.com/sites/marleycoyne/2020/04/03/zooms-big-security-problems-summarized/',
        linkText: 'Zooms Security Problems',
    },
    {
        id: 'two',
        class: 'dark',
        next: '#three',
        headline:
            'Do you know what personal data is being collected by the software your employer or school requires?',
        url:
            'https://www.theguardian.com/technology/2020/apr/02/zoom-technology-security-coronavirus-video-conferencing',
        linkText:
            '...security researchers have called Zoom “a privacy disaster” and “fundamentally corrupt” as allegations of the company mishandling user data snowball.',
    },
    {
        id: 'three',
        class: 'grey',
        next: '#four',
        headline:
            'Do you know what alternatives might exist, or what they might cost?',
        url:
            'https://www.wired.com/story/zoom-jitsi-offers-open-source-alternative-zoom/',
        linkText: 'Want to Ditch Zoom? Jitsi Offers an Open-Source Alternative',
    },
];
