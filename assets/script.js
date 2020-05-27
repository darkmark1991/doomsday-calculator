    let LANG = 'en';

    const localization = {
        pageTitle: {
            en: 'Doomsday Rule',
            ge: 'განკითხვის დღის წესი'
        },
        datePlaceholder: {
            en: 'Enter date (Ex.: 1937-12-26)',
            ge: 'შეიყვანეთ თარიღი (მაგ.:1937-12-26)'
        },
        dateTitle: {
            en: 'Date format: YYYY-MM-DD',
            ge: 'თარიღის ფორმატი: YYYY-MM-DD'
        },
        inputError: {
            en: 'Please enter a valid date: YYYY-MM-DD',
            ge: 'გთხოვთ შეიყვანოთ სწორი თარიღი: YYYY-MM-DD'
        },
        centuryDoomsdayTexts: {
            en: ['The anchor doomsday for ', 'th century is '],
            ge: ['მე-', ' საუკუნის ფუძე-დღე არის ']
        },
        yearNumText: {
            en: 'The last two digits of the year are ',
            ge: 'წლის ბოლო ორი ციფრი არის '
        },
        remainder: {
            en: 'remainder',
            ge: 'ნაშთი'
        },
        modulo: {
            en: 'modulo',
            ge: 'მოდული'
        },
        yearDoomsdayTexts: {
            en: ['The year doomsday for ', ' is ', ' days from century doomsday (', ').<br>So it is: '],
            ge: ['განკითხვის დღე ', ' წლისთვის არის ', ' დღით დაშორებული საუკუნის განკითხვის დღიდან', 'ანუ არის: ']
        },
        closestDoomsdayText: {
            en: 'is closest to doomsday date',
            ge: 'ყველაზე ახლოს არის განკითხვის დღესთან ამ თარიღში'
        },
        dayOfTheWeekTexts: {
            en: ['So it is', 'days away from newrest doomsday, which makes it a'],
            ge: ['ანუ', 'დღითაა დაშორებული უახლოეს განკითხვის დღეს, ანუ არის']
        },
    }
    // check for georgian language in navigator
    if (!!navigator && !!navigator.languages && !!navigator.languages.length) {
        for (let i = 0; i < navigator.languages.length; i++) {
            if (navigator.languages[i].indexOf('ka') !== -1 || navigator.languages[i].indexOf('ge') !== -1) {
                LANG = 'ge';
                break;
            }
        }
    }

    const switchLang = (lang) => {
        LANG = lang;
        if(LANG === 'ge') {
            $('#geSwitch').css('font-weight','bold');
            $('#enSwitch').css('font-weight','normal');
            $('.lang-en').hide()
            $('.lang-ge').show();
        } else {
            $('#enSwitch').css('font-weight','bold');
            $('#geSwitch').css('font-weight','normal');
            $('.lang-ge').hide()
            $('.lang-en').show();
        }
        $('#pageTitle').innerHTML = localization.pageTitle[LANG];
        $('#date').attr('placeholder', localization.datePlaceholder[LANG]);
        $('#date').attr('title', localization.dateTitle[LANG]);
    }
    switchLang(LANG);
    const daysOfWeek = {
        en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        ge: ['კვირა', 'ორშაბათი', 'სამშაბათი', 'ოთხშაბათი', 'ხუთშაბათი', 'პარასკევი', 'შაბათი']
    };
    const anchorDoomsdays = [3, 2, 0, 5];
    // The first values are zeroed out to make month number correspond to index
    const monthDoomsdays = [NaN, 3, 28, 0, 4, 9, 6, 11, 8, 5, 10, 7, 12]
    const months = {
        en: ['N/A', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        ge: ['N/A', 'იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი']
    };

    const calcClosestDoomsday = (month, day, isLeapYear) => {
        console.log(month)
        let doomsMonth =
            (monthDoomsdays[month] + 30 + monthDoomsdays[month+1]) / 2 < day ? month : month + 1;
        let doomsDay = monthDoomsdays[doomsMonth]
        if (isLeapYear && (doomsMonth === 1 || doomsMonth === 2)) doomsDay++;
        return { month: doomsMonth, day: doomsDay };
    }

    const calcDoomsday = () => {
        const date = document.getElementById('date').value;
        // chack if Date.parse returned NaN
        if (Date.parse(date) !== Date.parse(date)) {
            document.getElementById('error').innerHTML =
                localization.inputError[LANG];
            document.getElementById('centuryDoomsday').innerHTML = '';
            document.getElementById('calculateYear').innerHTML = '';
            document.getElementById('yearNum').innerHTML = '';
            document.getElementById('yearDoomsday').innerHTML = '';
            document.getElementById('closestDoomsday').innerHTML = '';
            document.getElementById('dayOfTheWeek').innerHTML = '';
            document.getElementById('conclusion').innerHTML = '';
            return;
        } else {
            document.getElementById('error').innerHTML = '';
        }
        let [year, month, day] = date.split('-');
        month = month * 1;
        const yy = year % 100;
        const century = ~~(year / 100) + 1;
        const centuryDoomsday = anchorDoomsdays[century % 4];

        document.getElementById('centuryDoomsday').innerHTML =
            `1. ${localization.centuryDoomsdayTexts[LANG][0]}${century}${localization.centuryDoomsdayTexts[LANG][1]}<strong>${daysOfWeek[LANG][centuryDoomsday]}</strong>`;

        document.getElementById('yearNum').innerHTML =
            `2. ${localization.yearNumText[LANG]} Y = <strong>${yy}</strong>`;

        const tmpA = ~~(yy / 12);
        const tmpB = yy % 12;
        const tmpC = ~~(tmpB / 4);
        const tmpD = (tmpA + tmpB + tmpC) % 7;
        const yearDoomsday = (centuryDoomsday + tmpD) % 7;

        document.getElementById('calculateYear').innerHTML =
            `${yy} / 12 = ${tmpA} + ${tmpB} (A = ${tmpA}, B = ${tmpB})<br>
            ${tmpB} / 4 = ${tmpC} + ${localization.remainder[LANG]} (C = ${tmpC})<br>
            D = (${tmpA} + ${tmpB} + ${tmpC}) ${localization.modulo[LANG]} 7 = ${tmpD} <br>`;

        document.getElementById('yearDoomsday').innerHTML =
            `${localization.yearDoomsdayTexts[LANG][0]}${year}${localization.yearDoomsdayTexts[LANG][1]}${tmpD}${localization.yearDoomsdayTexts[LANG][2]},
            ${localization.yearDoomsdayTexts[LANG][3]}<strong>${daysOfWeek[LANG][yearDoomsday]}</strong>`;

        const isLeapYear = year % 4 == 0;

        const closestDoomsday = calcClosestDoomsday(month, day, isLeapYear);
        console.log(closestDoomsday)

        document.getElementById('closestDoomsday').innerHTML =
            `3. ${day} ${months[LANG][month]} ${localization.closestDoomsdayText[LANG]} ${closestDoomsday.day}/${closestDoomsday.month}`;

        // TODO: count from above
        const dayOfTheWeek = (yearDoomsday + (day - closestDoomsday.day) % 7) % 7;

        document.getElementById('dayOfTheWeek').innerHTML =
            `${localization.dayOfTheWeekTexts[LANG][0]}
            ((${day} - ${closestDoomsday.day}) ${localization.modulo[LANG]} 7) = ${(day - closestDoomsday.day) % 7}
            ${localization.dayOfTheWeekTexts[LANG][1]} <strong>${daysOfWeek[LANG][dayOfTheWeek]}</strong>`;

        document.getElementById('conclusion').innerHTML =
            `${months[LANG][month]} ${day}, ${year} was a ${daysOfWeek['en'][dayOfTheWeek]}`;
    }
