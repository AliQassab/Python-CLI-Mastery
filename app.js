let currentLesson = "basics";
let completedLessons = new Set(["basics"]); // Mark basics as completed initially

// Challenge details data
const challenges = {
  echo: {
    title: "🔊 Echo Command Challenge",
    description:
      "Build a simple echo command that prints arguments to stdout, with options for newlines and escaping.",
    requirements: [
      "Accept multiple arguments and print them separated by spaces.",
      "Add `-n` flag to suppress the trailing newline.",
      "Add `-e` flag to enable escape sequence interpretation (e.g., `\\n` for newline, `\\t` for tab).",
      "Handle empty input gracefully.",
    ],
    starter: `#!/usr/bin/env python3
import argparse
import sys

def main():
    parser = argparse.ArgumentParser(prog="echo", description="Display a line of text.")
    # Add your arguments here (e.g., for -n, -e, and positional text)
    
    args = parser.parse_args()
    
    # Your implementation here:
    # 1. Join the input text arguments.
    # 2. Process escape sequences if -e is enabled.
    # 3. Print the result with or without a newline based on -n.
    
if __name__ == "__main__":
    main()`,
    solution: `#!/usr/bin/env python3
import argparse
import sys

def main():
    parser = argparse.ArgumentParser(prog="echo", description="Display a line of text.")
    parser.add_argument("-n", action="store_true", help="Do not output the trailing newline.")
    parser.add_argument("-e", action="store_true", help="Enable interpretation of backslash escapes.")
    parser.add_argument("text", nargs="*", help="The text to display.")
    
    args = parser.parse_args()
    
    # Join all positional arguments with a space
    output = " ".join(args.text)
    
    # Handle escape sequences if -e flag is used
    if args.e:
        # Replace common escape sequences. Note: double backslash is needed for literal backslash.
        output = output.replace("\\\\n", "\\n").replace("\\\\t", "\\t").replace("\\\\v", "\\v")
        output = output.replace("\\\\r", "\\r").replace("\\\\f", "\\f").replace("\\\\b", "\\b")
        output = output.replace("\\\\a", "\\a") # Alert (bell)
    
    # Print with or without a newline based on the -n flag
    if args.n:
        print(output, end="") # 'end=""' suppresses the default newline
    else:
        print(output)

if __name__ == "__main__":
    main()`,
  },
  head: {
    title: "📄 Head Command Challenge",
    description:
      "Show the first N lines of files, just like the Unix head command.",
    requirements: [
      "Default to showing the first 10 lines if no number is specified.",
      "Add `-n NUM` flag to specify the number of lines to show.",
      "Handle multiple files: print a header (`==> filename <==`) before each file's content.",
      "Gracefully handle files with fewer lines than requested (print all available lines).",
      "Handle `FileNotFoundError` and other potential file errors.",
    ],
    starter: `#!/usr/bin/env python3
import argparse
import sys
import os

def main():
    parser = argparse.ArgumentParser(prog="head", description="Output the first part of files.")
    # Add your arguments here (e.g., -n for line count, and positional files)
    
    args = parser.parse_args()
    
    # Your implementation here:
    # 1. Loop through each file provided.
    # 2. For multiple files, print a header.
    # 3. Read lines from the file and print up to 'N' lines.
    # 4. Handle file errors.
    
if __name__ == "__main__":
    main()`,
    solution: `#!/usr/bin/env python3
import argparse
import sys
import os

def main():
    parser = argparse.ArgumentParser(prog="head", description="Output the first part of files.")
    parser.add_argument(
        "-n", "--lines",
        type=int,
        default=10, # Default to 10 lines
        help="Print the first NUM lines instead of the first 10."
    )
    parser.add_argument(
        "files",
        nargs="+", # Requires one or more files
        help="The files to read and output."
    )
    
    args = parser.parse_args()
    
    for i, filename in enumerate(args.files):
        try:
            # Print filename header if more than one file is provided
            if len(args.files) > 1:
                if i > 0: # Add a blank line between file outputs
                    print()
                print(f"==> {filename} <==")
            
            with open(filename, "r", encoding="utf-8") as f:
                # Read lines and take only the first 'args.lines'
                for line_num, line in enumerate(f):
                    if line_num >= args.lines:
                        break # Stop after reading N lines
                    print(line, end="") # 'end=""' because readlines() keeps newlines
                
        except FileNotFoundError:
            print(f"head: {filename}: No such file or directory", file=sys.stderr)
            sys.exit(1)
        except Exception as error:
            print(f"head: {filename}: An unexpected error occurred: {error}", file=sys.stderr)
            sys.exit(1)

if __name__ == "__main__":
    main()`,
  },
  grep: {
    title: "🔍 Simple Grep Challenge",
    description: "Search for patterns in files and display matching lines.",
    requirements: [
      "Search for a given `PATTERN` in one or more `FILES`.",
      "Add `-i` flag for case-insensitive search.",
      "Add `-n` flag to show line numbers for matching lines.",
      "For multiple files, prefix matching lines with the filename (`filename:line`).",
      "Handle `FileNotFoundError` and invalid regex patterns.",
    ],
    starter: `#!/usr/bin/env python3
import argparse
import sys
import re # You'll need the regular expression module

def main():
    parser = argparse.ArgumentParser(prog="grep", description="Search text patterns in files.")
    # Add your arguments here (e.g., -i, -n, positional pattern and files)
    
    args = parser.parse_args()
    
    # Your implementation here:
    # 1. Compile the regex pattern, considering the -i flag.
    # 2. Loop through each file.
    # 3. Read the file line by line.
    # 4. Check if each line matches the pattern.
    # 5. Print matching lines with appropriate prefixes (-n, filename).
    # 6. Handle errors.
    
if __name__ == "__main__":
    main()`,
    solution: `#!/usr/bin/env python3
import argparse
import sys
import re

def main():
    parser = argparse.ArgumentParser(prog="grep", description="Search text patterns in files.")
    parser.add_argument("-i", "--ignore-case", action="store_true", help="Ignore case distinctions in patterns and data.")
    parser.add_argument("-n", "--line-number", action="store_true", help="Prefix each line of output with the 1-based line number.")
    parser.add_argument("pattern", help="The pattern to search for.")
    parser.add_argument("files", nargs="+", help="The files to search within.")
    
    args = parser.parse_args()
    
    # Compile the regex pattern, applying IGNORECASE flag if -i is set
    flags = re.IGNORECASE if args.ignore_case else 0
    try:
        regex = re.compile(args.pattern, flags)
    except re.error as e:
        print(f"grep: Invalid regex pattern: {e}", file=sys.stderr)
        sys.exit(2) # Convention for invalid usage
    
    for filename in args.files:
        try:
            with open(filename, "r", encoding="utf-8") as f:
                for line_num, line in enumerate(f, 1): # Start line numbers from 1
                    if regex.search(line):
                        output_prefix = ""
                        
                        # Add filename prefix if searching multiple files
                        if len(args.files) > 1:
                            output_prefix += f"{filename}:"
                        
                        # Add line number prefix if -n is set
                        if args.line_number:
                            output_prefix += f"{line_num}:"
                        
                        print(output_prefix + line.rstrip("\\n")) # rstrip to remove extra newline from print()
                        
        except FileNotFoundError:
            print(f"grep: {filename}: No such file or directory", file=sys.stderr)
            sys.exit(1)
        except Exception as error:
            print(f"grep: {filename}: An unexpected error occurred: {error}", file=sys.stderr)
            sys.exit(1)

if __name__ == "__main__":
    main()`,
  },
  tree: {
    title: "🌳 Tree Command Challenge",
    description:
      "Display directory structure in a tree format with proper indentation.",
    requirements: [
      "Show directory structure with tree-like formatting (using Unicode characters for branches).",
      "Add `-a` flag to show hidden files and directories (those starting with `.`).",
      "Add `-d` flag to show directories only, excluding files.",
      "Handle permission errors gracefully (e.g., print `[Permission Denied]`).",
      "Default to the current directory (`.`) if no directory is specified.",
    ],
    starter: `#!/usr/bin/env python3
import argparse
import os
import sys

def print_tree(path, args, prefix="", is_last=True):
    """
    Recursively prints the directory tree.
    :param path: The current path (file or directory) to print.
    :param args: The parsed arguments from argparse.
    :param prefix: The string prefix for indentation (e.g., "│   ").
    :param is_last: Boolean indicating if this is the last item in its parent's list.
    """
    # Your implementation here:
    # 1. Determine the connector (├── or └──) based on is_last.
    # 2. Print the current directory/file name with the prefix and connector.
    # 3. If it's a directory:
    #    a. Update the prefix for children (use "    " or "│   ").
    #    b. List directory contents, applying -a and -d filters.
    #    c. Sort items.
    #    d. Recursively call print_tree for each child.
    # 4. Handle PermissionError if os.listdir fails.

def main():
    parser = argparse.ArgumentParser(prog="tree", description="Display directory tree.")
    # Add your arguments here (e.g., -a, -d, positional directory)
    
    args = parser.parse_args()
    
    # Your implementation here:
    # 1. Validate the input directory.
    # 2. Call print_tree to start the recursion.
    
if __name__ == "__main__":
    main()`,
    solution: `#!/usr/bin/env python3
import argparse
import os
import sys

def print_tree(path, args, prefix="", is_last=True):
    """
    Recursively prints the directory tree.
    :param path: The current path (file or directory) to print.
    :param args: The parsed arguments from argparse.
    :param prefix: The string prefix for indentation (e.g., "│   ").
    :param is_last: Boolean indicating if this is the last item in its parent's list.
    """
    if not os.path.exists(path):
        return

    # Determine the connector for the current item
    connector = "└── " if is_last else "├── "
    
    # Get the base name of the path (e.g., "my_folder", "file.txt")
    # os.path.basename('') returns empty string, so handle root explicitly
    display_name = os.path.basename(path) or path 
    
    print(f"{prefix}{connector}{display_name}")
    
    # If it's not a directory, we're done with this branch
    if not os.path.isdir(path):
        return

    # Update the prefix for children
    # If the current item is the last, its children's prefix won't have a vertical line.
    extension = "    " if is_last else "│   "
    new_prefix = prefix + extension
    
    try:
        # Get directory contents
        items = os.listdir(path)
        
        # Filter hidden files/directories if -a is not set
        if not args.a:
            items = [item for item in items if not item.startswith('.')]
        
        # Filter to directories only if -d is set
        if args.d:
            items = [item for item in items if os.path.isdir(os.path.join(path, item))]
        
        # Sort items alphabetically
        items.sort()
        
        # Recursively print each item
        for i, item in enumerate(items):
            item_path = os.path.join(path, item)
            is_last_item = (i == len(items) - 1) # Check if this child is the last
            
            # Recursively call print_tree for both directories and files (unless -d is active)
            if os.path.isdir(item_path):
                print_tree(item_path, args, new_prefix, is_last_item)
            elif not args.d: # Only print files if -d is NOT active
                file_connector = "└── " if is_last_item else "├── "
                print(f"{new_prefix}{file_connector}{item}")
                
    except PermissionError:
        print(f"{new_prefix}[Permission Denied]")
    except Exception as e:
        print(f"{new_prefix}[Error: {e}]")


def main():
    parser = argparse.ArgumentParser(prog="tree", description="List contents of directories in a tree-like format.")
    parser.add_argument("-a", "--all", action="store_true", help="Do not ignore entries starting with .")
    parser.add_argument("-d", "--directories-only", action="store_true", help="List directories only.")
    parser.add_argument("directory", nargs="?", default=".", help="Directory to display (defaults to current directory).")
    
    args = parser.parse_args()
    
    # Validate if the provided path is a directory
    if not os.path.isdir(args.directory):
        print(f"tree: {args.directory}: No such directory", file=sys.stderr)
        sys.exit(1)
    
    # Start printing the tree from the specified directory
    print_tree(args.directory, args)

if __name__ == "__main__":
    main()`,
  },
};

// --- Custom Modal Functions ---
function showModal(title, message, isError = false) {
  const modalOverlay = document.getElementById("customModalOverlay");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");

  modalTitle.textContent = title;
  modalMessage.textContent = message;

  if (isError) {
    modalTitle.style.color = "#f56565"; // Red for errors
  } else {
    modalTitle.style.color = "#ffd89b"; // Default color
  }

  modalOverlay.classList.add("active");
}

function closeModal() {
  const modalOverlay = document.getElementById("customModalOverlay");
  modalOverlay.classList.remove("active");
}
// --- End Custom Modal Functions ---

function showLesson(lessonId, event) {
  // Hide all lessons
  document.querySelectorAll(".lesson-content").forEach((lesson) => {
    lesson.classList.remove("active");
  });

  // Remove active class from all buttons
  document.querySelectorAll(".lesson-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  // Show selected lesson
  document.getElementById(`lesson-${lessonId}`).classList.add("active");

  // Add active class to the clicked button
  if (event && event.target) {
    event.target.classList.add("active");
  } else {
    // Fallback for initial load or direct call without event
    const initialButton = document.querySelector(
      `.lesson-btn[onclick*="${lessonId}"]`
    );
    if (initialButton) {
      initialButton.classList.add("active");
    }
  }

  currentLesson = lessonId;
  completedLessons.add(lessonId);
  updateProgress();
}

function updateProgress() {
  const totalLessons = 6;
  const completed = completedLessons.size;
  const percentage = (completed / totalLessons) * 100;

  document.getElementById("progressBar").style.width = percentage + "%";
}

function selectQuizOption(option, isCorrect) {
  // Disable all options after a selection
  document.querySelectorAll(".quiz-option").forEach((opt) => {
    opt.disabled = true;
  });

  // Remove any existing classes
  document.querySelectorAll(".quiz-option").forEach((opt) => {
    opt.classList.remove("correct", "wrong");
  });

  // Add appropriate class
  if (isCorrect) {
    option.classList.add("correct");
    showModal(
      "🎉 Correct!",
      "You got it! Directory processing is key for navigating folders, and the accumulator pattern helps sum up counts across them."
    );
  } else {
    option.classList.add("wrong");
    showModal(
      "❌ Not Quite!",
      "Think about what operations you need for counting files/subdirectories: you'd need to traverse directories and keep running totals. The correct answer is Directory Traversal + Accumulator Pattern.",
      true
    );
  }

  // Re-enable options after a short delay or when modal is closed
  setTimeout(() => {
    document.querySelectorAll(".quiz-option").forEach((opt) => {
      opt.disabled = false;
      opt.classList.remove("correct", "wrong"); // Clear feedback for next attempt
    });
  }, 3000); // Re-enable after 3 seconds
}

function showChallenge(challengeId) {
  const challenge = challenges[challengeId];
  const detailsDiv = document.getElementById("challenge-details");

  detailsDiv.innerHTML = `
                <div class="interactive-example">
                    <h3 style="color: #ffd89b;">${challenge.title}</h3>
                    <p style="font-size: 1.1rem; margin-bottom: 20px;">${
                      challenge.description
                    }</p>
                    
                    <h4 style="color: #ffd89b; margin-bottom: 10px;">Requirements:</h4>
                    <ul style="margin-bottom: 20px; margin-left: 20px;">
                        ${challenge.requirements
                          .map((req) => `<li>${req}</li>`)
                          .join("")}
                    </ul>
                    
                    <div style="display: grid; grid-template-columns:  1fr; gap: 20px;">
                        <div>
                            <h4 style="color: #ffd89b; margin-bottom: 10px;">Starter Code:</h4>
                            <div class="code-container">
                                <div class="code-header">
                                    <div class="code-title">Your starting point</div>
                                    <button class="copy-btn" onclick="copyCode(this)">Copy</button>
                                </div>
                                <div class="code-content">
                                    <pre>${challenge.starter}</pre>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 style="color: #ffd89b; margin-bottom: 10px;">Solution:</h4>
                            <div class="code-container">
                                <div class="code-header">
                                    <div class="code-title">Complete solution</div>
                                    <button class="copy-btn" onclick="copyCode(this)">Copy</button>
                                </div>
                                <div class="code-content">
                                    <pre>${challenge.solution}</pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

  detailsDiv.style.display = "block";
  detailsDiv.scrollIntoView({ behavior: "smooth", block: "start" }); // Scroll to top of challenge
}

function copyCode(button) {
  const codeElement = button.closest(".code-container").querySelector("pre");
  const text = codeElement.textContent;

  navigator.clipboard.writeText(text).then(() => {
    const originalText = button.textContent;
    button.textContent = "Copied!";
    button.style.background = "#48bb78"; // Green for copied

    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = "#667eea"; // Revert to original color
    }, 2000);
  });
}

// Initialize everything when page loads
document.addEventListener("DOMContentLoaded", function () {
  // Set initial active lesson and update progress
  const initialLessonId = "basics";
  const initialButton = document.querySelector(
    `.lesson-btn[onclick*="${initialLessonId}"]`
  );
  if (initialButton) {
    initialButton.click(); // Simulate click to activate lesson and update progress
  }
});
