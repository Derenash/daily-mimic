import os
import logging

# Configure logging
logging.basicConfig(filename='folder_to_prompt.log', level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

def folder_to_prompt(folder_path):
    prompt = ""
    # Define a divider for visual separation between files and folders
    file_divider = "\n" + "-"*20 + "\n"
    folder_divider = "\n" + "="*50 + "\n"
    # Tuple of allowed file extensions
    allowed_extensions = (".html", ".ts", ".css")
   
    for root, dirs, files in os.walk(folder_path):
        # Skip the folder if it's empty
        if not dirs and not files:
            logging.info(f"Skipping empty folder: {root}")
            continue
       
        # Skip the folder if it doesn't contain any allowed files
        if not any(file.endswith(allowed_extensions) for file in files):
            logging.info(f"Skipping folder without allowed files: {root}")
            continue

        # Add the folder path as a header
        relative_path = os.path.relpath(root, folder_path)
        prompt += f"Folder: {relative_path if relative_path != '.' else root}" + folder_divider
        logging.info(f"Processing folder: {relative_path}")
       
        for file in sorted(files):  # Sorting files for better readability
            if file.endswith(allowed_extensions):
                file_path = os.path.join(root, file)
                # Add the file name
                prompt += f"File: {file}\n\n"
                logging.info(f"Processing file: {file}")
               
                # Try to read the content of each file
                try:
                    with open(file_path, 'r', encoding='utf-8') as file_content:
                        content = file_content.read()
                        prompt += content.strip() + file_divider  # strip() to remove unnecessary whitespace
                except Exception as e:
                    logging.error(f"Error reading file {file}: {e}")
                    prompt += f"Error reading file {file}: {e}" + file_divider
   
    logging.info("Folder processing completed.")
    return prompt.strip()  # strip() to remove any trailing dividers

# Replace 'your_folder_path_here' with the path to your target folder
folder_path = 'src/'
prompt = folder_to_prompt(folder_path)

# Save prompt to a file
with open('prompt.txt', 'w', encoding='utf-8') as file:
    file.write(prompt)
    logging.info("Prompt saved to prompt.txt")