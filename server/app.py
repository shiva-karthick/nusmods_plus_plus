# Referenced from: https://api.nusmods.com/v2/#
# Thanks to the nusmods team, from Shiva Year 3 Electrical Engineering NUS student

from flask import Flask, request, Blueprint
import requests
import json
from typing import Any, Dict, List, Union
import datetime
from .coursereg_history.api import get_data

main = Blueprint('main', __name__)

@main.route('/summary_modules_list', methods=['POST'])
def get_summary_modules_list():
    """
    brief: Get summaries of all modules for that academic year
    
    description: Get the module code, title and semesters which the module is available in for all modules in a year. 
    This is useful for tasks that only require a minimal set of information, such as simple search, 
    autocompleting module code and titles, and checking if a module code is valid. 
    NUSMods uses this information to validate module codes and for searching.
    """
    
    # get the module code from the POST request
    response = request.get_json()

    # sample data
    acadYear = response["acadYear"]

    url = f"https://api.nusmods.com/v2/{acadYear}/moduleList.json"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        raise ValueError("get_all_modules_list is not found.")
    

@main.route('/detailed_modules_list', methods=['POST'])
def get_detailed_modules_list():
    """
    brief: Get detailed information about all modules
    
    description: Get all information about modules except for timetable and prereq tree in a year. 
    This is compact enough to be loaded and filtered in browsers without lag and is useful for faceted search and detailed module listing. 
    NUSMods feeds this information into an Elasticsearch search server for the detailed module search page.
    """
    
    # get the module code from the POST request
    response = request.get_json()

    # sample data
    acadYear = response["acadYear"]

    url = f"https://api.nusmods.com/v2/{acadYear}/moduleInfo.json"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        raise ValueError("get_all_modules_details is not found.")
    

@main.route('/specific_module_details', methods=['POST'])
def get_specific_module():
    """
    brief: Get all information about a specific module
    
    description: Get all information available for a specific module including prerequite tree and timetable. 
    NUSMods uses this on the module information page.
    """
    
    # get the module code from the POST request
    response = request.get_json()

    # sample data
    acadYear = response["acadYear"]
    moduleCode = response["moduleCode"]

    url = f"https://api.nusmods.com/v2/{acadYear}/modules/{moduleCode}.json"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        raise ValueError("Invalid course code "
                         f"{acadYear}:{moduleCode} found.")

@main.route('/summary_venues', methods=['POST'])
def get_summary_venues():
    """
    brief: Get a list of all venues
    
    description: Get a list of all venues, including lecture theatres, seminar rooms, laboratories, etc. used in the given semester's classes. 
    This endpoint only returns an array of names, and is useful for searching and autocompletion.
    """
    
    # get the module code from the POST request
    response = request.get_json()

    # sample data
    acadYear = response["acadYear"]
    semester = response["semester"]

    url = f"https://api.nusmods.com/v2/{acadYear}/semesters/{semester}/venues.json"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        raise ValueError("get_all_venues is not found.")
    

@main.route('/detailed_venues', methods=['POST'])
def get_detailed_venues():
    """
    brief: Get detailed information about all venues
    
    description: Get detailed venue information including classes and occupancy for every venue. 
    This is useful for displaying a timetable of the given venue as well as for checking if a venue is occupied at any given time.
    """

    # get the module code from the POST request
    response = request.get_json()

    # sample data
    acadYear = response["acadYear"]
    semester = response["semester"]

    url = f"https://api.nusmods.com/v2/{acadYear}/semesters/{semester}/venueInformation.json"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        raise ValueError("get_all_venues is not found.")

###
# Demand Allocation
###

# The client will perform a POST request to this endpoint, to find out the demand allocation for a particular module
@main.route('/demand_allocation', methods=['POST'])
def get_demand_allocation():
    """
    brief: Get demand allocation for a particular module
    
    description: Get demand allocation for a particular module
    """
    
    # get the module code from the POST request
    response = request.get_json()

    # get the data from the database
    data = get_data(response["acadYear"], response["semester"], response["graduate"], response["moduleCode"])

    return data
    # return "Done", 201

###
# Firebase APIS
###