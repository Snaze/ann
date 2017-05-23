import React from 'react';

/**
 * This class had weird behavior when binding to key events.
 *
 * The event was being fired off twice.
 *
 * TODO: Figure out how to do this.
 */
class DocumentStub {

    static get body() {
        if (typeof(document) !== "undefined") {
            return document;
        }

        return (<div></div>);
    }
}

export default DocumentStub;