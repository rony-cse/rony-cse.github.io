---
# Leave the homepage title empty to use the site title
title: ""
date: 2025-03-25
type: landing

design:
  # Default section spacing
  spacing: "2rem"

sections:
  - block: resume-biography-3
    content:
      # Choose a user profile to display (a folder name within `content/authors/`)
      username: admin
      text: ""
      # Show a call-to-action button under your biography? (optional)
      button:
        text: View CV
        url: https://drive.google.com/file/d/1WS4-rJVYSeoV7-L42zI5JUlKKOquZ53o/view?usp=sharing
        
    design:
      css_class: dark
      background:
        image:
          # Add your image background to `assets/media/`.
          filename: stacked-peaks.svg
          filters:
            brightness: 1.0
          size: cover
          position: center
          parallax: false
  # - block: markdown
  #   content:
  #     title: '📚 My Research'
  #     subtitle: ''
  #     text: |-
  #       Use this area to speak to your mission. I'm a research scientist in the Moonshot team at DeepMind. I blog about machine learning, deep learning, and moonshots.

  #       I apply a range of qualitative and quantitative methods to comprehensively investigate the role of science and technology in the economy.
        
  #       Please reach out to collaborate 😃
  #   design:
  #     columns: '1'
  # - block: collection
  #   id: papers
  #   content:
  #     title: Featured Publications
  #     filters:
  #       folders:
  #         - publication
  #       featured_only: true
  #   design:
  #     view: article-grid
  #     columns: 2
  - block: collection
    id: papers
    css_class: "css-1"
    content:
      title: Research
      text: |
        <span style='font-size: medium;'>For the latest updates, please visit my <a href='https://scholar.google.com/citations?user=3ScF50oAAAAJ' style='color: red; font-weight: bold;'>📚 Google Scholar</a> page.</span>  
        <br>  
        <span style='font-size: medium;'>My research interests include Computer Vision and Robotics. I have bit of experience in Deep Learning, Machine Learning, XAI. Most recently working on Semantic Segmentation and actively <u>seeking a PhD opportunity 🎓</u></span>


      filters:
        folders:
          - publication
        exclude_featured: false
    design:
      view: citation 
      # columns: 1 
      # background:
      #   color: blue
      # css_class: "css-1"
      css_style: |
        font-size: small;
        # color: #fff;
        line-height: 1.5;
        margin-top: 10px;
        margin-bottom: 10px;
        padding: 10px;
        border-radius: 8px;


        /* Adjustments for dark theme */
        @media (prefers-color-scheme: dark) {
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);  /* Darker shadow for dark theme */
        }
        font-size: small;
        # color:rgb(41, 43, 43);
        line-height: 1.5;
        margin-top: 5px;
        margin-bottom: 5px;
        # background-color: blue;
        # padding: 10px;
        border-radius: 8px;
        /* Default box shadow */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

        /* Light theme */
        @media (prefers-color-scheme: light) {
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);  /* Lighter shadow for light theme */
        }

        /* Dark theme */
        @media (prefers-color-scheme: dark) {
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);  /* Darker shadow for dark theme */
        }

  - block: collection
    id: talks
    content:
      title: Media Coverage
      filters:
        folders:
          - event
    design:
      view: compact #article-grid
      columns: 1
      css_style: |
        font-size: small;
        # color: #fff;
        line-height: 1.5;
        margin-top: 10px;
        margin-bottom: 10px;
        padding: 10px;
        border-radius: 8px;


        /* Adjustments for dark theme */
        @media (prefers-color-scheme: dark) {
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);  /* Darker shadow for dark theme */
        }
        font-size: small;
        # color:rgb(41, 43, 43);
        line-height: 1.5;
        margin-top: 5px;
        margin-bottom: 5px;
        # background-color: blue;
        # padding: 10px;
        border-radius: 8px;
        /* Default box shadow */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

        /* Light theme */
        @media (prefers-color-scheme: light) {
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);  /* Lighter shadow for light theme */
        }

        /* Dark theme */
        @media (prefers-color-scheme: dark) {
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);  /* Darker shadow for dark theme */
        }

  # - block: resume-experience
  #   content:
  #     username: admin
  #   design:
  #     # Hugo date format
  #     date_format: 'January 2006'
  #     # Education or Experience section first?
  #     is_education_first: true
  #     css_style: |
  #         font-size: small;
  #         # color: #fff;
  #         line-height: 1.5;
  #         margin-top: 20px;
  #         margin-bottom: 20px;
  #         padding: 20px;
  #         border-radius: 8px;


  #         /* Adjustments for dark theme */
  #         @media (prefers-color-scheme: dark) {
  #           box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);  /* Darker shadow for dark theme */
  #         }
  #         font-size: small;
  #         # color:rgb(41, 43, 43);
  #         line-height: 1.5;
  #         margin-top: 5px;
  #         margin-bottom: 5px;
  #         # background-color: blue;
  #         # padding: 20px;
  #         border-radius: 8px;
  #         /* Default box shadow */
  #         box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  #         /* Light theme */
  #         @media (prefers-color-scheme: light) {
  #           box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);  /* Lighter shadow for light theme */
  #         }

  #         /* Dark theme */
  #         @media (prefers-color-scheme: dark) {
  #           box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);  /* Darker shadow for dark theme */
  #         }
  - block: resume-skills
    content:
      title: Skills
      username: admin
    design:
      show_skill_percentage: false
      css_style: |
        font-size: small;
        # color: #fff;
        line-height: 1.5;
        margin-top: 10px;
        margin-bottom: 10px;
        padding: 10px;
        border-radius: 8px;


        /* Adjustments for dark theme */
        @media (prefers-color-scheme: dark) {
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);  /* Darker shadow for dark theme */
        }
        font-size: small;
        # color:rgb(41, 43, 43);
        line-height: 1.5;
        margin-top: 10px;
        margin-bottom: 10px;
        # background-color: blue;
        # padding: 10px;
        border-radius: 8px;
        /* Default box shadow */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

        /* Light theme */
        @media (prefers-color-scheme: light) {
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);  /* Lighter shadow for light theme */
        }

        /* Dark theme */
        @media (prefers-color-scheme: dark) {
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);  /* Darker shadow for dark theme */
        }


  - block: collection
    id: news
    content:
      title: Recent News
      subtitle: ''
      text: ''
      # Page type to display. E.g. post, talk, publication...
      page_type: post
      # Choose how many pages you would like to display (0 = all pages)
      count: 5
      # Filter on criteria
      filters:
        author: ""
        category: ""
        tag: ""
        exclude_featured: false
        exclude_future: false
        exclude_past: false
        publication_type: ""
      # Choose how many pages you would like to offset by
      offset: 0
      # Page order: descending (desc) or ascending (asc) date.
      order: desc
    design:
      # Choose a layout view
      view:  date-title-summary
      # Reduce spacing
      spacing:
        padding: [0, 0, 0, 0]
      css_style: |
        font-size: small;
        color: #fff;
        line-height: 1.5;
        margin-top: 10px;
        margin-bottom: 10px;
        padding: 10px;
        border-radius: 8px;

---
