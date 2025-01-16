module.exports = {
    name: "Volume Fixer",
    description: "Makes the volume slider exponential for easier adjustment of lower volumes.",
    version: "1.0",
    author: "Kotaless",
    context: ["renderer"],
    scope: ["own"],
    func: () => {
        // Port of https://greasyfork.org/en/scripts/487324-youtube-volume-fixer
        'use strict';

        function log(...args) {
            console.log("[Volume Fixer]", ...args);
        }

        const EXPONENT = 2;

        const storedOriginalVolumes = new WeakMap();
        const { get, set } = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'volume');

        Object.defineProperty(HTMLMediaElement.prototype, 'volume', {
            get() {
                const lowVolume = get.call(this);
                const calculatedOriginalVolume = lowVolume ** (1 / EXPONENT);

                const storedOriginalVolume = storedOriginalVolumes.get(this);
                const storedDeviation = Math.abs(storedOriginalVolume - calculatedOriginalVolume);

                const originalVolume = storedDeviation < 0.01 ? storedOriginalVolume : calculatedOriginalVolume;
                return originalVolume;
            },
            set(originalVolume) {
                const lowVolume = originalVolume ** EXPONENT;
                storedOriginalVolumes.set(this, originalVolume);
                set.call(this, lowVolume);
            }
        });
    }
}