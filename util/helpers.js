const inputValidator = requestBody => {
  const validKeys = ["properties", "notation", "hit_level",  "damage", "speed", "on_block", "on_hit", "on_ch", "active_frames", "notes"];
  let inputKeys = Object.keys(requestBody);
  //ensure only valid keys were submitted
  for (let i=0; i < inputKeys.length; i++) {
    if (!validKeys.includes(inputKeys[i])) return false
  }
};

const validateSpeed = val => {
  let match = val.match(/[0-9]+/);
  if (val.length > 1 && val[0] === "0") return false
  return parseInt(val) >= 0 && match && match[0] === val || val === "-";
};

const validateFrames = val => {
    let matchNonzero = val.match(/^[\+|-][1-9][0-9]*(?: (BT))$/); //must be a plus or minus for non-zero vals
    if (matchNonzero && matchNonzero[0].length > 1 && matchNonzero[0][0] === "0") return false //false if leading zero
    let isZero = val === "0";
    let unblockable = val === "!";
    let permissibleString = ["KND", "STUN", "LAUNCH"].includes(val);
    return isZero || unblockable || permissibleString || matchNonzero;
};

//comma separated string of high, mid, low, s. mid
const validateHitLevel = val => {
  if (val === "-") return true
  let hits = val.split(", ");
  for (let i = 0; i < hits.length; i++) {
    let match = hits[i].match(/^(?:high|mid|low|s\. mid|throw)!?(?: throw)?$/);
    if (!match) {
      return false;
    }
  }
  return true;
};


exports.inputValidator = inputValidator;
