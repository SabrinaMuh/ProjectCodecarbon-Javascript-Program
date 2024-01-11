import logging
import sys
import time

from codecarbon import OfflineEmissionsTracker

tracker = OfflineEmissionsTracker(country_iso_code="AUT",
                                  measure_power_secs=30, )


def start_logger():
    logger = logging.getLogger("codecarbon")
    while logger.hasHandlers():
        logger.removeHandler(logger.handlers[0])

    formatter = logging.Formatter("%(asctime)s-%(levelname)s-|%(message)s|/n")

    fh = logging.FileHandler("codecarbon.log", 'w+')
    fh.setLevel(logging.DEBUG)
    fh.setFormatter(formatter)
    logger.addHandler(fh)

    consoleHandler = logging.StreamHandler(sys.stdout)
    consoleHandler.setFormatter(formatter)
    consoleHandler.setLevel(logging.WARNING)
    logger.addHandler(consoleHandler)

    logger.debug("GO!")

    tracker.start()


def stop_logger():
    tracker.stop()


def train_model():
    occurrence = 60 * 24 * 365 * 100
    delay = 30
    for i in range(occurrence):
        print(f"{occurrence * delay - i * delay} seconds before ending script...")
        time.sleep(delay)


if __name__ == "__main__":
    start_logger()
    try:
        model = train_model()
    finally:
        stop_logger()
