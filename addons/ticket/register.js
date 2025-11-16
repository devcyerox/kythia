/**
 * @namespace: addons/ticket/register.js
 * @type: Module
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.12-beta
 */

// const ticketCreateHandler = require('./buttons/ticketcreate.js');
// const ticketCloseHandler = require('./buttons/ticketclose.js');
// const panelModalShowHandler = require('./buttons/tkt-panel-modal-show.js');
// const typeModalShowHandler = require('./buttons/tkt-type-modal-show.js');

// const panelCreateHandler = require('./modals/tkt-panel-create.js');
// const typeCreateHandler = require('./modals/tkt-type-create.js');

// const ticketSelectHandler = require('./select_menus/ticketselect.js');
// const panelChannelHandler = require('./select_menus/tkt-panel-channel.js');
// const typePanelHandler = require('./select_menus/tkt-type-panel.js');
// const typeRoleHandler = require('./select_menus/tkt-type-role.js');
// const typeLogsHandler = require('./select_menus/tkt-type-logs.js');
// const typeTranscriptHandler = require('./select_menus/tkt-type-transcript.js');

// const initialize = (bot) => {
//     const summary = [];
//     try {
//         bot.registerButtonHandler('ticket-create', ticketCreateHandler.execute);
//         bot.registerButtonHandler('ticket-close', ticketCloseHandler.execute);
//         bot.registerSelectMenuHandler('ticketselect', ticketSelectHandler.execute);

//         summary.push("  └─ Interaction: 'ticket-create', 'ticket-close', 'ticketselect' (User Facing)");

//         bot.registerSelectMenuHandler('tkt-panel-channel', panelChannelHandler.execute);
//         bot.registerButtonHandler('tkt-panel-modal-show', panelModalShowHandler.execute);
//         bot.registerModalHandler('tkt-panel-create', panelCreateHandler.execute);

//         summary.push("  └─ Panel Setup: 'tkt-panel-channel', 'tkt-panel-modal-show', 'tkt-panel-create'");

//         bot.registerSelectMenuHandler('tkt-type-panel', typePanelHandler.execute);
//         bot.registerSelectMenuHandler('tkt-type-role', typeRoleHandler.execute);
//         bot.registerSelectMenuHandler('tkt-type-logs', typeLogsHandler.execute);
//         bot.registerSelectMenuHandler('tkt-type-transcript', typeTranscriptHandler.execute);
//         bot.registerButtonHandler('tkt-type-modal-show', typeModalShowHandler.execute);
//         bot.registerModalHandler('tkt-type-create', typeCreateHandler.execute);

//         summary.push(
//             "  └─ Type Setup: 'tkt-type-panel', 'tkt-type-role', 'tkt-type-logs', 'tkt-type-transcript', 'tkt-type-modal-show', 'tkt-type-create'"
//         );
//     } catch (error) {
//         console.error('Failed to register ticket handlers:', error);
//     }
//     return summary;
// };

// module.exports = {
//     initialize,
// };
/**
 * @namespace: addons/ticket/register.js
 * @type: Module (VERSI MEGA MODAL V5.0)
 * @copyright © 2025 kenndeclouv
 * @version 1.0.0
 */

const path = require('path');

const initialize = (bot) => {
    const summary = [];
    try {
        // === HANDLER TIKET NORMAL ===
        bot.registerButtonHandler('ticket-create', require('./buttons/ticket-create.js').execute);
        bot.registerButtonHandler('ticket-close', require('./buttons/ticket-close.js').execute);
        bot.registerSelectMenuHandler('ticket-select', require('./select_menus/ticket-select.js').execute);
        summary.push("  └─ Interaction: 'ticketcreate', 'ticketclose', 'ticketselect' (User Facing)");

        // === HANDLER ALUR 1: /ticket panel create ===
        bot.registerButtonHandler('tkt-panel-modal-show', require('./buttons/tkt-panel-modal-show.js').execute);
        bot.registerModalHandler('tkt-panel-create', require('./modals/tkt-panel-create.js').execute);
        summary.push("  └─ Panel Setup: 'tkt-panel-modal-show', 'tkt-panel-create'");

        // === HANDLER ALUR 2: /ticket type create ===
        bot.registerSelectMenuHandler('tkt-type-panel', require('./select_menus/tkt-type-panel.js').execute);
        bot.registerModalHandler('tkt-type-create', require('./modals/tkt-type-create.js').execute);
        summary.push("  └─ Type Setup: 'tkt-type-panel', 'tkt-type-create' (Mega Modal Flow)");
    } catch (error) {
        console.error('Failed to register ticket handlers:', error);
    }
    return summary;
};

module.exports = {
    initialize,
};
