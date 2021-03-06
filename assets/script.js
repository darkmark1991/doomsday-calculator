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
    btnCalculate: {
        en: 'Calculate',
        ge: 'გამოთვლა'
    },
    btnRandom: {
        en: 'Random',
        ge: 'შემთხვევითი თარიღი'
    },
    btnRandomTitle: {
        en: 'Random date between 1600 and 2199',
        ge: 'შემთხვევითი თარიღი 1600-სა და 2199-ს შორის'
    },
    inputError: {
        en: 'Please enter a valid date: YYYY-MM-DD',
        ge: 'გთხოვთ შეიყვანოთ სწორი თარიღი: YYYY-MM-DD'
    },
    centuryDoomsdayTexts: {
        en: ['The anchor doomsday for', 'century is'],
        ge: ['', 'საუკუნის ფუძე-დღე არის']
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
    behind: {
        en: 'behind',
        ge: 'უკან'
    },
    after: {
        en: 'after',
        ge: 'წინ'
    },
    isa: {
        en: 'is a',
        ge: 'არის'
    },
    conclusion: {
        en: 'Conclusion',
        ge: 'დასკვნა'
    },
    yearDoomsdayTexts: {
        en: ['The year doomsday for', 'is', 'days from century doomsday.', 'So it is:'],
        ge: ['განკითხვის დღე', 'წლისთვის არის', 'დღით დაშორებული საუკუნის განკითხვის დღიდან.', 'ანუ არის:']
    },
    closestDoomsdayText: {
        en: 'is closest to doomsday date',
        ge: 'ყველაზე ახლოს არის განკითხვის დღესთან ამ თარიღში'
    },
    dayOfTheWeekTexts: {
        en: ['So it is', 'days', 'nearest doomsday, which makes it a'],
        ge: ['ე.ი', 'დღით არის', 'უახლოესი განკითხვის დღიდან, ანუ არის']
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
    $('#btnCalculate').html(localization.btnCalculate[LANG]);
    $('#btnRandom').html(localization.btnRandom[LANG]);
    $('#btnRandom').attr('title', localization.btnRandomTitle[LANG]);
    $('#pageTitle').html(localization.pageTitle[LANG]);
    $('#date').attr('placeholder', localization.datePlaceholder[LANG]);
    $('#date').attr('title', localization.dateTitle[LANG]);
    if (!!$('#date').val()) {
        calcDoomsday();
    }
}
switchLang(LANG);
const daysOfWeek = {
    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    ge: ['კვირა', 'ორშაბათი', 'სამშაბათი', 'ოთხშაბათი', 'ხუთშაბათი', 'პარასკევი', 'შაბათი']
};
const anchorDoomsdays = [3, 2, 0, 5];
// The first values are zeroed out to make month number correspond to index
let monthDoomsdays = [NaN, 3, 28, 0, 4, 9, 6, 11, 8, 5, 10, 7, 12]
const months = {
    en: ['N/A', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    ge: ['N/A', 'იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი']
};

const calcClosestDoomsday = (month, day, isLeapYear) => {
    let step = 0, direction = 1, calculation = '';
    if (isLeapYear) {
        monthDoomsdays[1] = 4, monthDoomsdays[2] = 29;
    } else {
        monthDoomsdays[1] = 3, monthDoomsdays[2] = 28;
    }
    const daysInCurrentMonth = (month === 2) ? (28 + isLeapYear) : 31 - (month - 1) % 7 % 2;

    let doomsMonth =
        month === 12 || monthDoomsdays[month] === day || (monthDoomsdays[month] + daysInCurrentMonth + monthDoomsdays[month+1]) / 2 < day ? month : (month + 1);
    
    let doomsDay = monthDoomsdays[doomsMonth];

    // check if the doomsday of next month is closer
    if (doomsMonth > month) {
        direction = -1;
        step = (daysInCurrentMonth - day + doomsDay) % 7;
        calculation = `((${daysInCurrentMonth} - ${day} + ${doomsDay}) ${localization.modulo[LANG]} 7) = ${step}`;
    } else if (day < doomsDay) {
        direction = -1;
        step = (doomsDay - day) % 7;
        calculation = `((${doomsDay} - ${day}) ${localization.modulo[LANG]} 7) = ${step}`;
    } else { 
        step = (day - doomsDay) % 7;
        calculation = `((${day} - ${doomsDay}) ${localization.modulo[LANG]} 7) = ${step}`;
    }
    return { month: doomsMonth, day: doomsDay, step: step, direction: direction, calculation: calculation };
}

const centuryText = (c) => {
    let str = '';
    if (LANG === 'ge') {
        if (c < 4) {
            str = c === 1 ? 'პირველი' : c === 2 ? 'მეორე' : 'მესამე';
        } else if (c % 100 === 0 || c < 21) {
            str = `მე-${c}`;
        } else {
            str = `${c}-ე`
        }
    } else {
        str = `${c}<sup>${
            ~~(c / 10) % 2 === 0 ? (c % 10 === 1 ? 'st' : c % 10 === 2 ? 'nd' : c % 10 === 2 ? 'rd' : 'th') : 'th'
        }</sup>`;
    }
    return str;
}

const dateText = (y, m, d) => {
    let str = '';
    if (LANG === 'ge') {
        str = `${y} წლის ${d === 1 ? 'პირველი' : d} ${months[LANG][m]}`;
    } else {
        str = `${months[LANG][m]} ${d}<sup>${
            d > 3 && d < 21 ? 'th' : (d % 10 === 1 ? 'st' : d % 10 === 2 ? 'nd' : d % 10 === 3 ? 'rd' : 'th')
        }</sup>,
        ${y}`;
    }
    return str;
}

// trigger calcDoomsday on enter
$('#date').keypress(function (e) {
    if (e.which == 13) {
        calcDoomsday();
        return false;
    }
});

const calcDoomsday = () => {
    let dateStr = $('#date').val();
    let date = Date.parse($('#date').val());
    // chack if Date.parse returned NaN
    if (date !== date) {
        $('#error').html(localization.inputError[LANG]).show();
        $('#dateInConsideration').html('').hide();
        $('#centuryDoomsday').html('').hide();
        $('#calculateYear').html('').hide();
        $('#yearNum').html('').hide();
        $('#yearDoomsday').html('').hide();
        $('#closestDoomsday').html('').hide();
        $('#dayOfTheWeek').html('').hide();
        $('#conclusion').html('').hide();
        $('#result').collapse('show');
        return;
    } else {
        $('#error').html('').hide();
    }

    date = new Date(date);

    let year, month, day;
    if (/[0-9]{1,4}-[0-9]{1,2}-[0-9]{1,2}/g.test(dateStr)) {
        [year, month, day] = dateStr.split('-');
        year *= 1;
        month *= 1;
        day *= 1;
    } else {
        year = date.getFullYear() * 1;
        month = date.getMonth() * 1 + 1;
        day = date.getDate() * 1;
    }

    $('#dateInConsideration').html(
        `<strong>${dateText(year, month, day)}:</strong>`
    ).show();

    const yy = year % 100;
    const century = ~~(year / 100) + 1;
    const centuryDoomsday = anchorDoomsdays[century % 4];

    $('#centuryDoomsday').html(
        `1. ${localization.centuryDoomsdayTexts[LANG][0]} ${centuryText(century)} ${localization.centuryDoomsdayTexts[LANG][1]} <strong>${daysOfWeek[LANG][centuryDoomsday]}</strong>`
    ).show();

    $('#yearNum').html(
        `2. ${localization.yearNumText[LANG]} Y = <strong>${yy}</strong>`
    ).show();

    const tmpA = ~~(yy / 12);
    const tmpB = yy % 12;
    const tmpC = ~~(tmpB / 4);
    const tmpD = (tmpA + tmpB + tmpC) % 7;
    const yearDoomsday = (centuryDoomsday + tmpD) % 7;

    $('#calculateYear').html(
        `${yy} / 12 = ${tmpA} + ${localization.remainder[LANG]} ${tmpB} (A = ${tmpA}, B = ${tmpB})<br>
        ${tmpB} / 4 = ${tmpC} + ${localization.remainder[LANG]} X (C = ${tmpC})<br>
        D = (${tmpA} + ${tmpB} + ${tmpC}) ${localization.modulo[LANG]} 7 = ${tmpD} <br>`
    ).show();

    $('#yearDoomsday').html(
        `${localization.yearDoomsdayTexts[LANG][0]} ${year} ${localization.yearDoomsdayTexts[LANG][1]} ${tmpD} ${localization.yearDoomsdayTexts[LANG][2]}
        ${localization.yearDoomsdayTexts[LANG][3]} <strong>${daysOfWeek[LANG][yearDoomsday]}</strong>`
    ).show();

    const isLeapYear = year % 4 == 0;

    const closestDoomsday = calcClosestDoomsday(month, day, isLeapYear);

    $('#closestDoomsday').html(
        `3. ${day} ${months[LANG][month]} ${localization.closestDoomsdayText[LANG]} ${closestDoomsday.day}/${closestDoomsday.month}`
    ).show();

    const dayOfTheWeek = (yearDoomsday + closestDoomsday.step * closestDoomsday.direction + 7) % 7;

    $('#dayOfTheWeek').html(
        `${localization.dayOfTheWeekTexts[LANG][0]} ${closestDoomsday.calculation} ${localization.dayOfTheWeekTexts[LANG][1]} `
        + (closestDoomsday.direction === 1 ? localization.after[LANG] : localization.behind[LANG])
        + ` ${localization.dayOfTheWeekTexts[LANG][2]} <strong>${daysOfWeek[LANG][dayOfTheWeek]}</strong>`
    ).show();

    $('#conclusion').html(
        `${localization.conclusion[LANG]}: ${dateText(year, month, day)} ${localization.isa[LANG]} ${daysOfWeek[LANG][dayOfTheWeek]}`
    ).show();

    $('#result').collapse('show');
}

const randomDate = () => {
    const start = new Date(1600, 0, 1);
    const end = new Date(2199, 11, 31);
    let date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    date = date.getFullYear() + '-' + ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1) + '-' + (date.getDate() < 10 ? '0' : '') + date.getDate();
    $('#date').val(date);
    calcDoomsday();
}