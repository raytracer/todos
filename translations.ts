export const T = (key: keyof typeof TRANSLATIONS) => {
    return TRANSLATIONS[key][L];
}

export const TRANSLATIONS = {
    "PLACEHOLDER": {
        "de": "Heute muss ich ...",
        "en": "Today I have to ..."
    },
    "ADD": {
        "de": "Hinzufügen",
        "en": "Add",
    },
    "INBOX": {
        "de": "Inbox",
        "en": "Inbox",
    },
    "TODAY": {
        "de": "Heute",
        "en": "Today",
    },
    "TOMORROW": {
        "de": "Morgen",
        "en": "Tomorrow",
    },
    "THIS_WEEK": {
        "de": "Diese Woche",
        "en": "This Week",
    },
    "NEXT_WEEK": {
        "de": "Nächste Woche",
        "en": "Next Week",
    },
    "LATER": {
        "de": "Später",
        "en": "Later",
    },
};

const L = "de";
