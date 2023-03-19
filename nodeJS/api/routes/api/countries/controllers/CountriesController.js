const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const verifyToken =  require('../../utils/auth');

const Country = require('../models/Country');

router.get('/all', (req, res) => {
    Country.find()
        .sort({ id: 1 })
        .then(items => {
            res.json(items);
        });
});

router.get('/init',verifyToken, async (req, res) => {

    const allCountries = [
        { name: { english: 'Afghanistan' }, code: 'AF' },
        { name: { english: 'Åland Islands' }, code: 'AX' },
        { name: { english: 'Albania' }, code: 'AL' },
        { name: { english: 'Algeria' }, code: 'DZ' },
        { name: { english: 'American Samoa' }, code: 'AS' },
        { name: { english: 'AndorrA' }, code: 'AD' },
        { name: { english: 'Angola' }, code: 'AO' },
        { name: { english: 'Anguilla' }, code: 'AI' },
        { name: { english: 'Antarctica' }, code: 'AQ' },
        { name: { english: 'Antigua and Barbuda' }, code: 'AG' },
        { name: { english: 'Argentina' }, code: 'AR' },
        { name: { english: 'Armenia' }, code: 'AM' },
        { name: { english: 'Aruba' }, code: 'AW' },
        { name: { english: 'Australia' }, code: 'AU' },
        { name: { english: 'Austria' }, code: 'AT' },
        { name: { english: 'Azerbaijan' }, code: 'AZ' },
        { name: { english: 'Bahamas' }, code: 'BS' },
        { name: { english: 'Bahrain' }, code: 'BH' },
        { name: { english: 'Bangladesh' }, code: 'BD' },
        { name: { english: 'Barbados' }, code: 'BB' },
        { name: { english: 'Belarus' }, code: 'BY' },
        { name: { english: 'Belgium' }, code: 'BE' },
        { name: { english: 'Belize' }, code: 'BZ' },
        { name: { english: 'Benin' }, code: 'BJ' },
        { name: { english: 'Bermuda' }, code: 'BM' },
        { name: { english: 'Bhutan' }, code: 'BT' },
        { name: { english: 'Bolivia' }, code: 'BO' },
        { name: { english: 'Bosnia and Herzegovina' }, code: 'BA' },
        { name: { english: 'Botswana' }, code: 'BW' },
        { name: { english: 'Bouvet Island' }, code: 'BV' },
        { name: { english: 'Brazil' }, code: 'BR' },
        { name: { english: 'British Indian Ocean Territory' }, code: 'IO' },
        { name: { english: 'Brunei Darussalam' }, code: 'BN' },
        { name: { english: 'Bulgaria' }, code: 'BG' },
        { name: { english: 'Burkina Faso' }, code: 'BF' },
        { name: { english: 'Burundi' }, code: 'BI' },
        { name: { english: 'Cambodia' }, code: 'KH' },
        { name: { english: 'Cameroon' }, code: 'CM' },
        { name: { english: 'Canada' }, code: 'CA' },
        { name: { english: 'Cape Verde' }, code: 'CV' },
        { name: { english: 'Cayman Islands' }, code: 'KY' },
        { name: { english: 'Central African Republic' }, code: 'CF' },
        { name: { english: 'Chad' }, code: 'TD' },
        { name: { english: 'Chile' }, code: 'CL' },
        { name: { english: 'China' }, code: 'CN' },
        { name: { english: 'Christmas Island' }, code: 'CX' },
        { name: { english: 'Cocos (Keeling) Islands' }, code: 'CC' },
        { name: { english: 'Colombia' }, code: 'CO' },
        { name: { english: 'Comoros' }, code: 'KM' },
        { name: { english: 'Congo' }, code: 'CG' },
        { name: { english: 'Congo, The Democratic Republic of the' }, code: 'CD' },
        { name: { english: 'Cook Islands' }, code: 'CK' },
        { name: { english: 'Costa Rica' }, code: 'CR' },
        { name: { english: 'Cote D\'Ivoire' }, code: 'CI' },
        { name: { english: 'Croatia' }, code: 'HR' },
        { name: { english: 'Cuba' }, code: 'CU' },
        { name: { english: 'Cyprus' }, code: 'CY' },
        { name: { english: 'Czech Republic' }, code: 'CZ' },
        { name: { english: 'Denmark' }, code: 'DK' },
        { name: { english: 'Djibouti' }, code: 'DJ' },
        { name: { english: 'Dominica' }, code: 'DM' },
        { name: { english: 'Dominican Republic' }, code: 'DO' },
        { name: { english: 'Ecuador' }, code: 'EC' },
        { name: { english: 'Egypt' }, code: 'EG' },
        { name: { english: 'El Salvador' }, code: 'SV' },
        { name: { english: 'Equatorial Guinea' }, code: 'GQ' },
        { name: { english: 'Eritrea' }, code: 'ER' },
        { name: { english: 'Estonia' }, code: 'EE' },
        { name: { english: 'Ethiopia' }, code: 'ET' },
        { name: { english: 'Falkland Islands (Malvinas)' }, code: 'FK' },
        { name: { english: 'Faroe Islands' }, code: 'FO' },
        { name: { english: 'Fiji' }, code: 'FJ' },
        { name: { english: 'Finland' }, code: 'FI' },
        { name: { english: 'France' }, code: 'FR' },
        { name: { english: 'French Guiana' }, code: 'GF' },
        { name: { english: 'French Polynesia' }, code: 'PF' },
        { name: { english: 'French Southern Territories' }, code: 'TF' },
        { name: { english: 'Gabon' }, code: 'GA' },
        { name: { english: 'Gambia' }, code: 'GM' },
        { name: { english: 'Georgia' }, code: 'GE' },
        { name: { english: 'Germany' }, code: 'DE' },
        { name: { english: 'Ghana' }, code: 'GH' },
        { name: { english: 'Gibraltar' }, code: 'GI' },
        { name: { english: 'Greece' }, code: 'GR' },
        { name: { english: 'Greenland' }, code: 'GL' },
        { name: { english: 'Grenada' }, code: 'GD' },
        { name: { english: 'Guadeloupe' }, code: 'GP' },
        { name: { english: 'Guam' }, code: 'GU' },
        { name: { english: 'Guatemala' }, code: 'GT' },
        { name: { english: 'Guernsey' }, code: 'GG' },
        { name: { english: 'Guinea' }, code: 'GN' },
        { name: { english: 'Guinea-Bissau' }, code: 'GW' },
        { name: { english: 'Guyana' }, code: 'GY' },
        { name: { english: 'Haiti' }, code: 'HT' },
        { name: { english: 'Heard Island and Mcdonald Islands' }, code: 'HM' },
        { name: { english: 'Holy See (Vatican City State)' }, code: 'VA' },
        { name: { english: 'Honduras' }, code: 'HN' },
        { name: { english: 'Hong Kong' }, code: 'HK' },
        { name: { english: 'Hungary' }, code: 'HU' },
        { name: { english: 'Iceland' }, code: 'IS' },
        { name: { english: 'India' }, code: 'IN' },
        { name: { english: 'Indonesia' }, code: 'ID' },
        { name: { english: 'Iran, Islamic Republic Of' }, code: 'IR' },
        { name: { english: 'Iraq' }, code: 'IQ' },
        { name: { english: 'Ireland' }, code: 'IE' },
        { name: { english: 'Isle of Man' }, code: 'IM' },
        { name: { english: 'Israel' }, code: 'IL' },
        { name: { english: 'Italy' }, code: 'IT' },
        { name: { english: 'Jamaica' }, code: 'JM' },
        { name: { english: 'Japan' }, code: 'JP' },
        { name: { english: 'Jersey' }, code: 'JE' },
        { name: { english: 'Jordan' }, code: 'JO' },
        { name: { english: 'Kazakhstan' }, code: 'KZ' },
        { name: { english: 'Kenya' }, code: 'KE' },
        { name: { english: 'Kiribati' }, code: 'KI' },
        { name: { english: 'Korea, Democratic People\'S Republic of' }, code: 'KP' },
        { name: { english: 'Korea, Republic of' }, code: 'KR' },
        { name: { english: 'Kuwait' }, code: 'KW' },
        { name: { english: 'Kyrgyzstan' }, code: 'KG' },
        { name: { english: 'Lao People\'S Democratic Republic' }, code: 'LA' },
        { name: { english: 'Latvia' }, code: 'LV' },
        { name: { english: 'Lebanon' }, code: 'LB' },
        { name: { english: 'Lesotho' }, code: 'LS' },
        { name: { english: 'Liberia' }, code: 'LR' },
        { name: { english: 'Libyan Arab Jamahiriya' }, code: 'LY' },
        { name: { english: 'Liechtenstein' }, code: 'LI' },
        { name: { english: 'Lithuania' }, code: 'LT' },
        { name: { english: 'Luxembourg' }, code: 'LU' },
        { name: { english: 'Macao' }, code: 'MO' },
        { name: { english: 'Macedonia, The Former Yugoslav Republic of' }, code: 'MK' },
        { name: { english: 'Madagascar' }, code: 'MG' },
        { name: { english: 'Malawi' }, code: 'MW' },
        { name: { english: 'Malaysia' }, code: 'MY' },
        { name: { english: 'Maldives' }, code: 'MV' },
        { name: { english: 'Mali' }, code: 'ML' },
        { name: { english: 'Malta' }, code: 'MT' },
        { name: { english: 'Marshall Islands' }, code: 'MH' },
        { name: { english: 'Martinique' }, code: 'MQ' },
        { name: { english: 'Mauritania' }, code: 'MR' },
        { name: { english: 'Mauritius' }, code: 'MU' },
        { name: { english: 'Mayotte' }, code: 'YT' },
        { name: { english: 'Mexico' }, code: 'MX' },
        { name: { english: 'Micronesia, Federated States of' }, code: 'FM' },
        { name: { english: 'Moldova, Republic of' }, code: 'MD' },
        { name: { english: 'Monaco' }, code: 'MC' },
        { name: { english: 'Mongolia' }, code: 'MN' },
        { name: { english: 'Montserrat' }, code: 'MS' },
        { name: { english: 'Morocco' }, code: 'MA' },
        { name: { english: 'Mozambique' }, code: 'MZ' },
        { name: { english: 'Myanmar' }, code: 'MM' },
        { name: { english: 'Namibia' }, code: 'NA' },
        { name: { english: 'Nauru' }, code: 'NR' },
        { name: { english: 'Nepal' }, code: 'NP' },
        { name: { english: 'Netherlands' }, code: 'NL' },
        { name: { english: 'Netherlands Antilles' }, code: 'AN' },
        { name: { english: 'New Caledonia' }, code: 'NC' },
        { name: { english: 'New Zealand' }, code: 'NZ' },
        { name: { english: 'Nicaragua' }, code: 'NI' },
        { name: { english: 'Niger' }, code: 'NE' },
        { name: { english: 'Nigeria' }, code: 'NG' },
        { name: { english: 'Niue' }, code: 'NU' },
        { name: { english: 'Norfolk Island' }, code: 'NF' },
        { name: { english: 'Northern Mariana Islands' }, code: 'MP' },
        { name: { english: 'Norway' }, code: 'NO' },
        { name: { english: 'Oman' }, code: 'OM' },
        { name: { english: 'Pakistan' }, code: 'PK' },
        { name: { english: 'Palau' }, code: 'PW' },
        { name: { english: 'Palestinian Territory, Occupied' }, code: 'PS' },
        { name: { english: 'Panama' }, code: 'PA' },
        { name: { english: 'Papua New Guinea' }, code: 'PG' },
        { name: { english: 'Paraguay' }, code: 'PY' },
        { name: { english: 'Peru' }, code: 'PE' },
        { name: { english: 'Philippines' }, code: 'PH' },
        { name: { english: 'Pitcairn' }, code: 'PN' },
        { name: { english: 'Poland' }, code: 'PL' },
        { name: { english: 'Portugal' }, code: 'PT' },
        { name: { english: 'Puerto Rico' }, code: 'PR' },
        { name: { english: 'Qatar' }, code: 'QA' },
        { name: { english: 'Reunion' }, code: 'RE' },
        { name: { english: 'Romania' }, code: 'RO' },
        { name: { english: 'Russian Federation' }, code: 'RU' },
        { name: { english: 'RWANDA' }, code: 'RW' },
        { name: { english: 'Saint Helena' }, code: 'SH' },
        { name: { english: 'Saint Kitts and Nevis' }, code: 'KN' },
        { name: { english: 'Saint Lucia' }, code: 'LC' },
        { name: { english: 'Saint Pierre and Miquelon' }, code: 'PM' },
        { name: { english: 'Saint Vincent and the Grenadines' }, code: 'VC' },
        { name: { english: 'Samoa' }, code: 'WS' },
        { name: { english: 'San Marino' }, code: 'SM' },
        { name: { english: 'Sao Tome and Principe' }, code: 'ST' },
        { name: { english: 'Saudi Arabia' }, code: 'SA' },
        { name: { english: 'Senegal' }, code: 'SN' },
        { name: { english: 'Serbia and Montenegro' }, code: 'CS' },
        { name: { english: 'Seychelles' }, code: 'SC' },
        { name: { english: 'Sierra Leone' }, code: 'SL' },
        { name: { english: 'Singapore' }, code: 'SG' },
        { name: { english: 'Slovakia' }, code: 'SK' },
        { name: { english: 'Slovenia' }, code: 'SI' },
        { name: { english: 'Solomon Islands' }, code: 'SB' },
        { name: { english: 'Somalia' }, code: 'SO' },
        { name: { english: 'South Africa' }, code: 'ZA' },
        { name: { english: 'South Georgia and the South Sandwich Islands' }, code: 'GS' },
        { name: { english: 'Spain' }, code: 'ES' },
        { name: { english: 'Sri Lanka' }, code: 'LK' },
        { name: { english: 'Sudan' }, code: 'SD' },
        { name: { english: 'Suriname' }, code: 'SR' },
        { name: { english: 'Svalbard and Jan Mayen' }, code: 'SJ' },
        { name: { english: 'Swaziland' }, code: 'SZ' },
        { name: { english: 'Sweden' }, code: 'SE' },
        { name: { english: 'Switzerland' }, code: 'CH' },
        { name: { english: 'Syrian Arab Republic' }, code: 'SY' },
        { name: { english: 'Taiwan, Province of China' }, code: 'TW' },
        { name: { english: 'Tajikistan' }, code: 'TJ' },
        { name: { english: 'Tanzania, United Republic of' }, code: 'TZ' },
        { name: { english: 'Thailand' }, code: 'TH' },
        { name: { english: 'Timor-Leste' }, code: 'TL' },
        { name: { english: 'Togo' }, code: 'TG' },
        { name: { english: 'Tokelau' }, code: 'TK' },
        { name: { english: 'Tonga' }, code: 'TO' },
        { name: { english: 'Trinidad and Tobago' }, code: 'TT' },
        { name: { english: 'Tunisia' }, code: 'TN' },
        { name: { english: 'Turkey' }, code: 'TR' },
        { name: { english: 'Turkmenistan' }, code: 'TM' },
        { name: { english: 'Turks and Caicos Islands' }, code: 'TC' },
        { name: { english: 'Tuvalu' }, code: 'TV' },
        { name: { english: 'Uganda' }, code: 'UG' },
        { name: { english: 'Ukraine' }, code: 'UA' },
        { name: { english: 'United Arab Emirates' }, code: 'AE' },
        { name: { english: 'United Kingdom' }, code: 'GB' },
        { name: { english: 'United States' }, code: 'US' },
        { name: { english: 'United States Minor Outlying Islands' }, code: 'UM' },
        { name: { english: 'Uruguay' }, code: 'UY' },
        { name: { english: 'Uzbekistan' }, code: 'UZ' },
        { name: { english: 'Vanuatu' }, code: 'VU' },
        { name: { english: 'Venezuela' }, code: 'VE' },
        { name: { english: 'Viet Nam' }, code: 'VN' },
        { name: { english: 'Virgin Islands, British' }, code: 'VG' },
        { name: { english: 'Virgin Islands, U.S.' }, code: 'VI' },
        { name: { english: 'Wallis and Futuna' }, code: 'WF' },
        { name: { english: 'Western Sahara' }, code: 'EH' },
        { name: { english: 'Yemen' }, code: 'YE' },
        { name: { english: 'Zambia' }, code: 'ZM' },
        { name: { english: 'Zimbabwe' }, code: 'ZW' }
    ];

    allCountries.forEach(function (country, index) {
        //console.log(`${fruit.id}, ${fruit.name},${fruit.Section}`);
        const newObject = new Country({
            code: country.code,
            name: country.name
        });
        newObject._id = new mongoose.Types.ObjectId();
        newObject.save().then(createdObject => {

            console.log('saved into database...');
            //res.json(createdObject);
        }).catch(e => {
            console.log('cannot save into database', e.message);
            //res.json(e);
        });

    })

    res.json(allCountries);
});


// "/v1/countries/{id}"
router.get('/get/:id', (req, res) => {
    Country.findOne({ _id: req.params.id })
        .sort({ id: 1 })
        .then(items => {
            res.json(items);
        });
});

// "/v1/countries/create"
router.post('/create', verifyToken, async (req, res) => {
    const newObject = new Country({
        ...req.body
    });
    newObject._id = new mongoose.Types.ObjectId();
    newObject.save().then(createdObject => {

        console.log('saved into database...');
        res.json(createdObject);
    }).catch(e => {
        console.log('cannot save into database', e.message);
        res.json(e);
    });
});

// "/v1/countries/update"
router.post('/update', verifyToken, async (req, res) => {
    Country.findByIdAndUpdate(req.body._id, req.body, function (err, item) {
        console.log('saved into database...');
        res.json(item);
    })


});

// "/v1/countries/remove/{id}"
router.get('/remove/:id', verifyToken, async (req, res) => {
    Country.findById(req.params.id)
        .then(item =>
            item.remove().then(() => res.json({ success: true }))).catch(e => res.status(404).json({ success: false }));
});

module.exports = router;