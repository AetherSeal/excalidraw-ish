# Project Documentation

## Project Overview

This project is a frontend take-home assignment aimed at demonstrating proficiency in modern web development practices. The goal is to create a responsive and visually appealing user interface.

## Technology Choices

### Tailwind CSS

I chose Tailwind CSS for the following reasons:

- **Utility-First Approach**: Tailwind's utility-first approach allows for rapid styling without writing custom CSS.
- **Customization**: It offers extensive customization options, making it easy to adapt to specific design requirements.
- **Responsive Design**: Built-in responsive design utilities facilitate the creation of mobile-friendly interfaces.

### React Icons

I chose React Icons for the following reasons:

- **Wide Range of Icons**: React Icons provides a comprehensive collection of icons from various libraries.
- **Ease of Use**: Integrating icons into React components is straightforward and efficient.
- **Consistency**: Using a single library ensures a consistent look and feel across the application.

## Motivation

The primary motivation behind these choices was to enable fast development. Tailwind CSS and React Icons significantly reduce the time required to style components and integrate icons, allowing for a quicker turnaround on the project.

## Canvas Implementation

### Tools Used

In the canvas implementation of the paint feature, I have included the following tools:

- **HTML5 Canvas**: Utilized for rendering the drawing area.
- **Fabric.js**: A powerful and simple JavaScript HTML5 canvas library that provides an interactive object model on top of the canvas element.

### State Management

To manage the state of the canvas and avoid prop drilling, I used the Context API. This approach allows for a more organized and maintainable codebase by providing a way to share state across the entire component tree without passing props down manually at every level.

### Future Refinements

If further refinement is needed, we could consider separating the canvas component even more. This could involve breaking down the canvas into smaller, more focused components, each responsible for a specific part of the functionality. This would enhance modularity and make the codebase easier to manage and extend.

### Features Implemented

The following features have been implemented in the canvas:

- **Draw Like a Pencil**: Allows freehand drawing similar to using a pencil.
- **Draw a Line**: Enables drawing straight lines.
- **Erase Like a Smudge**: Provides a smudge-like erasing effect.
- **Erase as an Eraser**: Standard eraser functionality to remove parts of the drawing.
- **Draw Ellipse**: Allows drawing ellipses.
- **Draw Square**: Enables drawing squares.
- **Draw Triangle**: Allows drawing triangles.
- **Draw Text**: Enables adding text to the canvas.
- **Clear the Canvas**: Provides an option to clear the entire canvas.
- **Fill and Empty Shapes**: Allows filling shapes with color or leaving them empty.
- **Default Colors**: Predefined set of colors for drawing.
- **Color Picking**: Custom color selection for drawing.
- **Size of the Lines**: Adjustable line thickness for drawing.
- **Undo**: Reverts the last action performed on the canvas.
- **Redo**: Reapplies the last undone action on the canvas.
- **Save as an Image**: Allows saving the current canvas drawing as an image file.

### Future Enhancements

We could have made the history persistent by using local storage or mocking an API to save and retrieve the canvas state. However, due to time constraints, this feature was not implemented.
