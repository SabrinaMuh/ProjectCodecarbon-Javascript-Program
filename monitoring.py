from codecarbon import EmissionsTracker
from codecarbon.output import EmissionsData, HTTPOutput
from time import sleep

if __name__ == '__main__':

    monitoring_interval: int = 5  # interval in seconds

    endpoint_url: str = 'http://localhost:8080/cc'
    http_output = HTTPOutput(endpoint_url)

    with EmissionsTracker(measure_power_secs=5, save_to_file=False) as tracker:

        while True:

            sleep(monitoring_interval)

            emissions: EmissionsData = tracker._prepare_emissions_data(
                delta=False)

            # send emission data to REST endpoint
            http_output.out(emissions)
