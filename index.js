const core = require('@actions/core');
const exec = require('@actions/exec');

async function run() {
    try {
        const sandboxes = JSON.parse(core.getInput('sandboxes'));
        const event = core.getInput('event');
        const allowedEvents = ['start', 'stop', 'delete', 'restart', 'reset', 'list'];

        // Check if incoming event is allowed and
        // throw an error and exit this action if it's not  
        if (allowedEvents.includes(event) === false) {
            core.setFailed('Not a valid event input. Expected one of the following: start | stop | delete | restart | reset | list');
        }

        if (sandboxes !== undefined && sandboxes.length > 0) {
            // Loop through all sandboxes returned by previous action step
            for (let sandbox of sandboxes) {
                switch (event) {
                    case 'delete':
                        await exec.exec('sfcc-ci sandbox:delete -N -s', [sandbox.id]);
                        break;
                    case 'reset':
                        await exec.exec('sfcc-ci sandbox:reset -N -s', [sandbox.id]);
                        break;
                    case 'list':
                        await exec.exec('sfcc-ci sandbox:list -S state');
                        break;
                    default:
                        await exec.exec(`sfcc-ci sandbox:${event} -s`, [sandbox.id]);
                        break;
                }

                // Exit loop as we need to list sandboxes status only once
                if (event === 'list') {
                    break;
                }
            }
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
