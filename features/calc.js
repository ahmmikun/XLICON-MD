const { cmd } = require('../lib');
cmd(
    {
        pattern: 'calc',
        desc: 'A simple calculator command for basic arithmetic operations.',
        catergory: 'watsusi',
    },
    (Void, citel, text) => {
        const parts = text.split(' ');
        if (parts.length !== 3) {
            return citel.reply('Usage: !calc <num1> <operator> <num2>');
        }
        const num1 = parseFloat(parts[0]);
        const operator = parts[1];
        const num2 = parseFloat(parts[2]);
        if (isNaN(num1) || isNaN(num2)) {
            return citel.reply('Please provide valid numerical values.');
        }
        let result;
        switch (operator) {
            case '+':
                result = num1 + num2;
                break;
            case '-':
                result = num1 - num2;
                break;
            case '*':
                result = num1 * num2;
                break;
            case '/':
                result = num1 / num2;
                break;
            default:
                return citel.reply('Invalid operator. Supported operators are +, -, *, and /.');
        }
        citel.reply(`Result: ${result}`);
    },
);
