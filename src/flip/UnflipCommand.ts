import {Command} from '../Command';
import CommandError from '../CommandError';
import {
  ALARMED,
  ANGUISH,
  COOL, COOL_LEFT,
  getFace,
  HAPPY, HAPPY_LEFT,
  LENNY,
  LOOK,
  PRETTY, PRETTY_LEFT, PUPPY,
  RAGE,
  SMILE,
  SOLEMN, STRAINED, STRAINED_LEFT,
  U_CANT_BE_SRS,
} from '../Faces';
import {PERSON, PHRASE, TABLE} from './FlipableItems';

const RIGHT = 'RIGHT';
const LEFT = 'LEFT';

const AVAILABLE_COMMANDS = [
  '-table',
  '-rage',
  '-alarmed',
  '-lenny',
  '-right',
  '-anguish',
  '-smile',
  '-happy',
  '-cool',
  '-puppy',
  '-strained',
  '-pretty',
  '-look',
  '-deadpan',
  '-help'];

function getAvailableArgumentsString() {
  return `Available Arguments: ${AVAILABLE_COMMANDS.join(', ').trim()}`;
}

const actuallyParseUnFlipArguments = unflipArgumentToParse => {
  const parsedArguments = unflipArgumentToParse.split(' ');
  const argumentProjection = parsedArguments.reduce((builtArguments, currentString) => {
    if (currentString === '-table') {
      builtArguments.flippedItem = {type: TABLE};
    } else if (currentString === '-rage') {
      builtArguments.face = {type: RAGE};
    } else if (currentString === '-alarmed') {
      builtArguments.face = {type: ALARMED};
    } else if (currentString === '-solemn') {
      builtArguments.face = {type: SOLEMN};
    } else if (currentString === '-lenny') {
      builtArguments.face = {type: LENNY};
    } else if (currentString === '-anguish') {
      builtArguments.face = {type: ANGUISH};
    } else if (currentString === '-smile') {
      builtArguments.face = {type: SMILE};
    } else if (currentString === '-look') {
      builtArguments.face = {type: LOOK};
    } else if (currentString === '-happy') {
      builtArguments.face = {type: HAPPY_LEFT};
    } else if (currentString === '-right') {
      builtArguments.direction = {type: RIGHT};
    } else if (currentString === '-deadpan') {
      builtArguments.face = {type: U_CANT_BE_SRS};
    } else if (currentString === '-pretty') {
      builtArguments.face = {type: PRETTY_LEFT};
    } else if (currentString === '-cool') {
      builtArguments.face = {type: COOL_LEFT};
    } else if (currentString === '-puppy') {
      builtArguments.face = {type: PUPPY};
    } else if (currentString === '-strained') {
      builtArguments.face = {type: STRAINED_LEFT};
    }  else if (currentString === '-help') {
      throw new CommandError(`Un-Flip Usage`, getAvailableArgumentsString());
    } else if (currentString.startsWith('-')) {
      throw new CommandError(`Unknown Argument: ${currentString}`, getAvailableArgumentsString());
    } else if (builtArguments.flippedItem.type === PHRASE) {
      builtArguments.flippedItem.payload += `${currentString} `;
    }
    return builtArguments;
  }, {
    flippedItem: {
      type: PHRASE,
      payload: '',
    },
    face: {
      type: SOLEMN,
    },
    direction: {
      type: LEFT,
    },
  });
  return Promise.resolve(argumentProjection)
    .then(argumentProj => {
      const {flippedItem: {type, payload}} = argumentProj;
      if (type === PHRASE && !payload) {
        return {
          ...argumentProj,
          flippedItem: {type: TABLE},
        };
      } else {
        return argumentProj;
      }
    });
};

const getNoArgumentUnFlippedItem = (unFlipArgument: string) =>
  !unFlipArgument ? ({type: TABLE}) : ({
    type: PHRASE,
    payload: unFlipArgument,
  });

const parseUnFlipArguments = unflipArguments => {
  return Promise.resolve(unflipArguments)
    .then(unflipArgument => {
      if (unflipArgument.indexOf('-') > -1) {
        return actuallyParseUnFlipArguments(unflipArgument);
      } else {
        return {
          flippedItem: getNoArgumentUnFlippedItem(unflipArgument),
          face: {
            type: SOLEMN,
          },
          direction: {
            type: LEFT,
          },
        };
      }
    });
};

const getUnFlippedItem = item => {
  switch (item.type) {
    case TABLE:
      return '┳━┳';
    case PERSON:
      return '(*￣m￣)';
    case PHRASE:
      return item.payload.trimRight();
  }
};

const extractUnFlipExpressionParts = flipArguments => {
  return parseUnFlipArguments(flipArguments)
    .then(parsedArguments => {
      const direction = parsedArguments.direction.type;
      const face = getFace(`${parsedArguments.face.type}_${direction}`) ||
        getFace(parsedArguments.face.type);
      const unFlippedItem = getUnFlippedItem(parsedArguments.flippedItem);
      return {
        face,
        unFlippedItem,
        direction,
      };
    });
};

export const unFlipCommand: Command = flipArguments => {
  return extractUnFlipExpressionParts(flipArguments)
    .then(({face, unFlippedItem, direction}) => {
      return direction === RIGHT ? `(ヽ${face})ヽ${unFlippedItem}` :
         `${unFlippedItem}ノ(${face}ノ)`;
    });
};
