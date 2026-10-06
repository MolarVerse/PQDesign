"""Sphinx configuration for the PQDesign manual."""

project = "PQDesign"
author = "MolarVerse"
copyright = "2026, MolarVerse"
extensions = ["myst_parser", "sphinx_copybutton"]
source_suffix = {".md": "markdown"}
root_doc = "index"
exclude_patterns = ["_build", ".DS_Store"]
myst_heading_anchors = 3
html_theme = "furo"
html_title = project
html_static_path = ["_static"]
html_css_files = ["pq-tokens.css", "pq-docs.css"]
html_theme_options = {
    "source_repository": "https://github.com/MolarVerse/PQDesign/",
    "source_branch": "main",
    "source_directory": "docs/",
}
html_baseurl = "https://molarverse.github.io/PQDesign/"
