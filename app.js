let currentLesson = "basics";
let completedLessons = new Set(["basics"]);

// Challenge details data
const challenges = {
  echo: {
    title: "🔊 Echo Command Challenge",
    description:
      "Build a command that prints its arguments, with options for newlines and escaping.",
    requirements: [
      "Accept multiple arguments and print them separated by spaces",
      "Add -n flag to suppress trailing newline",
      "Add -e flag to enable escape sequence interpretation",
      "Handle empty input gracefully",
    ],
    starter: `#!/usr/bin/env python3
import argparse
import sys

def main():
    parser = argparse.ArgumentParser(prog="echo", description="Display a line of text")
    # Add your arguments here
    
    args = parser.parse_args()
    
    # Your implementation here
    
if __name__ == "__main__":
    main()`,
    solution: `#!/usr/bin/env python3
import argparse
import sys

def main():
    parser = argparse.ArgumentParser(prog="echo", description="Display a line of text")
    parser.add_argument("-n", action="store_true", help="Do not output trailing newline")
    parser.add_argument("-e", action="store_true", help="Enable escape sequence interpretation")
    parser.add_argument("text", nargs="*", help="Text to display")
    
    args = parser.parse_args()
    
    # Join all arguments with spaces
    output = " ".join(args.text)
    
    # Handle escape sequences if -e flag is used
    if args.e:
        output = output.replace("\\\\n", "\\n").replace("\\\\t", "\\t")
    
    # Print with or without newline
    if args.n:
        print(output, end="")
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
      "Default to showing first 10 lines",
      "Add -n flag to specify number of lines",
      "Handle multiple files with headers",
      "Handle files with fewer lines than requested",
    ],
    starter: `#!/usr/bin/env python3
import argparse
import sys

def main():
    parser = argparse.ArgumentParser(prog="head", description="Output first part of files")
    # Add your arguments here
    
    args = parser.parse_args()
    
    # Your implementation here
    
if __name__ == "__main__":
    main()`,
    solution: `#!/usr/bin/env python3
import argparse
import sys

def main():
    parser = argparse.ArgumentParser(prog="head", description="Output first part of files")
    parser.add_argument("-n", type=int, default=10, help="Number of lines to show")
    parser.add_argument("files", nargs="+", help="Files to read")
    
    args = parser.parse_args()
    
    for i, filename in enumerate(args.files):
        try:
            # Show filename header for multiple files
            if len(args.files) > 1:
                if i > 0:
                    print()  # Blank line between files
                print(f"==> {filename} <==")
            
            with open(filename, "r", encoding="utf-8") as f:
                lines = f.readlines()
            
            # Show first n lines
            for line in lines[:args.n]:
                print(line, end="")  # readlines() keeps newlines
                
        except FileNotFoundError:
            print(f"head: {filename}: No such file or directory", file=sys.stderr)
        except Exception as error:
            print(f"head: {filename}: {error}", file=sys.stderr)

if __name__ == "__main__":
    main()`,
  },
  grep: {
    title: "🔍 Simple Grep Challenge",
    description: "Search for patterns in files and display matching lines.",
    requirements: [
      "Search for a pattern in one or more files",
      "Add -i flag for case-insensitive search",
      "Add -n flag to show line numbers",
      "Handle multiple files with filename prefixes",
    ],
    starter: `#!/usr/bin/env python3
import argparse
import sys
import re

def main():
    parser = argparse.ArgumentParser(prog="grep", description="Search text patterns in files")
    # Add your arguments here
    
    args = parser.parse_args()
    
    # Your implementation here
    
if __name__ == "__main__":
    main()`,
    solution: `#!/usr/bin/env python3
import argparse
import sys
import re

def main():
    parser = argparse.ArgumentParser(prog="grep", description="Search text patterns in files")
    parser.add_argument("-i", action="store_true", help="Case-insensitive search")
    parser.add_argument("-n", action="store_true", help="Show line numbers")
    parser.add_argument("pattern", help="Pattern to search for")
    parser.add_argument("files", nargs="+", help="Files to search")
    
    args = parser.parse_args()
    
    # Compile regex pattern
    flags = re.IGNORECASE if args.i else 0
    try:
        regex = re.compile(args.pattern, flags)
    except re.error as e:
        print(f"grep: {e}", file=sys.stderr)
        return
    
    for filename in args.files:
        try:
            with open(filename, "r", encoding="utf-8") as f:
                lines = f.readlines()
            
            for line_num, line in enumerate(lines, 1):
                if regex.search(line):
                    output = ""
                    
                    # Add filename if multiple files
                    if len(args.files) > 1:
                        output += f"{filename}:"
                    
                    # Add line number if requested
                    if args.n:
                        output += f"{line_num}:"
                    
                    output += line.rstrip()
                    print(output)
                    
        except FileNotFoundError:
            print(f"grep: {filename}: No such file or directory", file=sys.stderr)
        except Exception as error:
            print(f"grep: {filename}: {error}", file=sys.stderr)

if __name__ == "__main__":
    main()`,
  },
  tree: {
    title: "🌳 Tree Command Challenge",
    description:
      "Display directory structure in a tree format with proper indentation.",
    requirements: [
      "Show directory structure with tree-like formatting",
      "Add -a flag to show hidden files",
      "Add -d flag to show directories only",
      "Use Unicode characters for tree branches",
    ],
    starter: `#!/usr/bin/env python3
import argparse
import os
import sys

def main():
    parser = argparse.ArgumentParser(prog="tree", description="Display directory tree")
    # Add your arguments here
    
    args = parser.parse_args()
    
    # Your implementation here
    
if __name__ == "__main__":
    main()`,
    solution: `#!/usr/bin/env python3
import argparse
import os
import sys

def print_tree(path, args, prefix="", is_last=True):
    """Recursively print directory tree"""
    if not os.path.exists(path):
        return
    
    # Get directory name
    dirname = os.path.basename(path) or path
    
    # Print current directory
    connector = "└── " if is_last else "├── "
    print(f"{prefix}{connector}{dirname}")
    
    # Update prefix for children
    extension = "    " if is_last else "│   "
    new_prefix = prefix + extension
    
    try:
        # Get directory contents
        items = os.listdir(path)
        
        # Filter hidden files if not -a
        if not args.a:
            items = [item for item in items if not item.startswith('.')]
        
        # Filter to directories only if -d
        if args.d:
            items = [item for item in items if os.path.isdir(os.path.join(path, item))]
        
        # Sort items
        items.sort()
        
        # Print each item
        for i, item in enumerate(items):
            item_path = os.path.join(path, item)
            is_last_item = i == len(items) - 1
            
            if os.path.isdir(item_path):
                print_tree(item_path, args, new_prefix, is_last_item)
            else:
                connector = "└── " if is_last_item else "├── "
                print(f"{new_prefix}{connector}{item}")
                
    except PermissionError:
        print(f"{new_prefix}[Permission Denied]")

def main():
    parser = argparse.ArgumentParser(prog="tree", description="Display directory tree")
    parser.add_argument("-a", action="store_true", help="Show hidden files")
    parser.add_argument("-d", action="store_true", help="Show directories only")
    parser.add_argument("directory", nargs="?", default=".", help="Directory to display")
    
    args = parser.parse_args()
    
    if not os.path.isdir(args.directory):
        print(f"tree: {args.directory}: No such directory", file=sys.stderr)
        return
    
    print_tree(args.directory, args)

if __name__ == "__main__":
    main()`,
  },
};

function showLesson(lessonId) {
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
  event.target.classList.add("active");

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
  // Remove any existing classes
  document.querySelectorAll(".quiz-option").forEach((opt) => {
    opt.classList.remove("correct", "wrong");
  });

  // Add appropriate class
  if (isCorrect) {
    option.classList.add("correct");
    setTimeout(() => {
      alert(
        "🎉 Correct! Directory processing reads directories, and accumulator pattern keeps totals."
      );
    }, 100);
  } else {
    option.classList.add("wrong");
    setTimeout(() => {
      alert(
        "❌ Not quite. Think about what operations you need: reading directories and keeping counts."
      );
    }, 100);
  }
}

function showChallenge(challengeId) {
  const challenge = challenges[challengeId];
  const detailsDiv = document.getElementById("challenge-details");

  detailsDiv.innerHTML = `
                <div class="interactive-example">
                    <h3>${challenge.title}</h3>
                    <p style="font-size: 1.1rem; margin-bottom: 20px;">${
                      challenge.description
                    }</p>
                    
                    <h4 style="color: #ffd89b; margin-bottom: 10px;">Requirements:</h4>
                    <ul style="margin-bottom: 20px;">
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
  detailsDiv.scrollIntoView({ behavior: "smooth" });
}

function copyCode(button) {
  const codeElement = button.closest(".code-container").querySelector("pre");
  const text = codeElement.textContent;

  navigator.clipboard.writeText(text).then(() => {
    const originalText = button.textContent;
    button.textContent = "Copied!";
    button.style.background = "#48bb78";

    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = "#667eea";
    }, 2000);
  });
}

// Initialize
updateProgress();
