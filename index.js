const validDirections = ['N', 'NORTH', 'S', 'SOUTH', 'E', 'EAST', 'W', 'WEST'];
const validStreetTypes = {
	ALY: 'ALY',
	ALLEY: 'ALY',
	AVE: 'AVE',
	AVENUE: 'AVE',
	BOULEVARD: 'BLVD',
	BLVD: 'BLVD',
	BEND: 'BND',
	BND: 'BND',
	BRIDGE: 'BRG',
	BRG: 'BRG',
	CANYON: 'CYN',
	CANY: 'CANY',
	CYN: 'CYN',
	CIRCLE: 'CIR',
	CIR: 'CIR',
	COURT: 'CT',
	CT: 'CT',
	COVE: 'CV',
	CV: 'CV',
	DRIVE: 'DR',
	DR: 'DR',
	HIGHWAY: 'HWY',
	HWY: 'HWY',
	LANE: 'LN',
	LN: 'LN',
	LOOP: 'LOOP',
	MANOR: 'MNR',
	MNR: 'MNR',
	MOUNT: 'MT',
	MT: 'MT',
	PARK: 'PARK',
	PATH: 'PATH',
	PARKWAY: 'PKWY',
	PKWY: 'PKWY',
	PLACE: 'PL',
	PL: 'PL',
	PLAZA: 'PLZ',
	PLZ: 'PLZ',
	POINT: 'PT',
	PT: 'PT',
	ROAD: 'RD',
	RD: 'RD',
	RIDGE: 'RDG',
	RDG: 'RDG',
	ROW: 'ROW',
	RUN: 'RUN',
	STREET: 'ST',
	ST: 'ST',
	TRAIL: 'TRL',
	TRL: 'TRL',
	VIEW: 'VW',
	VW: 'VW',
	WAY: 'WY',
	WY: 'WY',
	CROSSING: 'XING',
	XING: 'XING',
};
const validLocations = ['ALPINE', 'ALPINE DIST', 'AMERICAN FORK', 'AMERICAN FORK DIST', 'BENJAMIN', 'BENJAMIN DIST', 'BIRDSEYE', 'CEDAR FORT', 'CEDAR HILLS', 'CEDAR VALLEY', 'COLTON', 'COVERED BRIDGE', 'DIAMOND FORK CANYON', 'DRAPER', 'EAGLE MOUNTAIN', 'ELBERTA', 'ELK RIDGE', 'EUREKA', 'FAIRFIELD', 'FAIRFIELD DIST', 'FAIRVIEW', 'GENOLA', 'GENOLA DIST', 'GOSHEN', 'GOSHEN DIST', 'H-NEBO DIST', 'HIGHLAND', 'LAKE SHORE', 'LEHI', 'LEHI DIST', 'LELAND', 'LINDON', 'LINDON DIST', 'MAPLETON', 'MAPLETON DIST', 'OREM', 'OREM MOUNTAIN DIST', 'PALMYRA', 'PAYSON', 'PAYSON DIST', 'PLEASANT GROVE', 'PLEASANT GROVE DIST', 'PROVO', 'PROVO CANYON DIST', 'SALEM', 'SALEM DIST', 'SANTAQUIN', 'SANTAQUIN DIST', 'SARATOGA SPRINGS', 'SPANISH FORK', 'SPANISH FORK DIST', 'SPRING LAKE', 'SPRINGVILLE', 'SPRINGVILLE DIST', 'SUNDANCE', 'THISTLE', 'THISTLE DIST', 'VINEYARD', 'WEST MOUNTAIN', 'WOODLAND HILLS'];
const validStates = ['UT', 'UTAH'];

const isDir = dir => validDirections.indexOf(dir.toUpperCase()) !== -1;
const isStreetType = s => Object.keys(validStreetTypes).indexOf(s.toUpperCase()) !== -1;
const isLocation = loc => validLocations.indexOf(loc.toUpperCase()) !== -1;
const isState = s => validStates.indexOf(s.toUpperCase()) !== -1;
const getStreetType = k => validStreetTypes[k.toUpperCase()];

const checkLocation = (index, arr) => {
    let val = arr[index].slice(0,4).toUpperCase() === 'DIST' ? arr[index].slice(0,4) : arr[index];
    while (!isLocation(val) && !(index < 1)) {
        val = arr[index - 1] + ' ' + val;
        index--;
    }
    return (isLocation(val)) ? { index, val } : null;
};

const parseAddress = address => {
    const addr = address.split(/[, .]/g).filter(x => x !== '');
    let pos = end = addr.length - 1;
    let zipIndex, stateIndex, locationIndex, streetTypeIndex, houseDirIndex, houseIndex, loc;
    const addObj = {
        house: '',
        houseDir: '',
        street: '',
        streetType: '',
        location: '',
        state: '',
        zipcode: '',
    };
    // 1st pass
    while (pos >= 0) {
        if (pos === end && addr[pos].match(/\d{1,5}-?\d*/g)) { // zipcode
            addObj.zipcode = addr[pos].split('-')[0];
            zipIndex = pos;
        } else if (isState(addr[pos])) { // state
            addObj.state = addr[pos].toUpperCase().slice(0, 2);
            stateIndex = pos;
        } else if (!locationIndex && (loc = checkLocation(pos, addr))) { // location
            addObj.location = loc.val.toUpperCase();
            locationIndex = pos = loc.index;
        } else if ((pos === end || [zipIndex, stateIndex, locationIndex].indexOf(pos + 1) !== -1) && isStreetType(addr[pos])) { // streetType
            addObj.streetType = getStreetType(addr[pos]);
            streetTypeIndex = pos;
        } else if (pos === 1 && isDir(addr[pos])) { // houseDir
            addObj.houseDir = addr[pos].toUpperCase()[0];
            houseDirIndex = pos;
        } else if (pos === 0 && addr[pos].match(/\d+/g)) { // house
            addObj.house = addr[pos];
            houseIndex = pos;
        }
        pos--;
    }
    let streetStart = houseDirIndex + 1 || houseIndex + 1 || 0;
    let streetEnd =  streetTypeIndex || locationIndex || stateIndex || zipIndex || end + 1;
    if (locationIndex !== streetStart) {
        addObj.street = addr.slice(streetStart, streetEnd).join(' ').toUpperCase();
    }
    if (addObj.street === '' && streetStart === 0) {
        if (addObj.house !== '' && addObj.houseDir !== '') {
            addObj.street = addObj.house + ' ' + addObj.houseDir;
            addObj.house = addObj.houseDir = '';
        }
    }
    return addObj;
};

module.exports = { parseAddress };