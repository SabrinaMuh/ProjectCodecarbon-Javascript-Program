# CodeCarbon Real-Time Plotting
<!-- this is a working title -->

- [CodeCarbon Real-Time Plotting](#codecarbon-real-time-plotting)
  - [Description](#description)
    - [Python-only Version](#python-only-version)
    - [API Version](#api-version)
  - [Installation Guide](#installation-guide)
  - [Run CodeCarbon Monitoring](#run-codecarbon-monitoring)

## Description

This is a JS program that works with CodeCarbon.

There are two versions of the Real-Time Plotting application.
On the website, you can switch between these versions.

### Logger Version
Works with the file log.txt and shows the data in a plot. The second plot shows the difference between the current value and the previous value.

### API Version

The API version works with the API from Codecarbon.

## Installation Guide

This section contains an installation guide on how to install the Python virtual environment using Anaconda.

The first option is to use the provided `environment.yml` file located at the root level of this project.
```bash
conda env create -f environment.yml 
```

The second option is to create an Anaconda environment yourself.

```bash
# create a Python virtual environment using Anaconda
conda create --name codecarbon
# activate the virtual environment
conda activate codecarbon
# install CodeCarbon inside the virtual environment
conda install -c conda-forge codecarbon
```

## Run CodeCarbon Monitoring

To run the CodeCarbon monitoring, enter the following commands into your CLI.

```bash
# initialize CodeCarbon with configurations
codecarbon init
# start the monitoring process and write to log file
codecarbon monitor 2> path_to_log_file.txt
# codecarbon monitor 2> <Path To ProjectCodecarbon-Javascript-Program File>
```

Error message info: "Cannot read properties of undefined (reading 'skip')" is a bug from Chart.js. Not from this program.
