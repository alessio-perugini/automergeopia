/**
 * Injects the CSS required for the blinking animation into the document's head.
 * This function ensures the styles are only added once.
 */
function addBlinkingStyles() {
    // ID for our custom style tag to prevent duplicates
    const styleId = 'blinker-style-sheet';

    // Check if the style tag already exists
    if (document.getElementById(styleId)) {
        return;
    }

    // Create the style element
    const styleElement = document.createElement('style');
    styleElement.id = styleId;

    // Define the CSS keyframe animation and the class to apply it
    styleElement.innerHTML = `
        @keyframes rainbow-corners-blinker {
            0%   { box-shadow: 0 0 10px 2px red; }
            16%  { box-shadow: 0 0 10px 2px orange; }
            33%  { box-shadow: 0 0 10px 2px yellow; }
            50%  { box-shadow: 0 0 10px 2px green; opacity: 0.2; } /* Fade out slightly */
            66%  { box-shadow: 0 0 10px 2px blue; }
            83%  { box-shadow: 0 0 10px 2px indigo; }
            100% { box-shadow: 0 0 10px 2px violet; opacity: 1; }
        }

        @keyframes rocket-fly {
            0% {
                bottom: -20px;
                left: -20px;
                opacity: 1;
                transform: rotate(45deg);
            }
            100% {
                bottom: 120%;
                left: 120%;
                opacity: 0;
                transform: rotate(45deg);
            }
        }

        .blinking-corners {
            animation: rainbow-corners-blinker 3s linear infinite;
            position: relative; /* Needed for positioning child elements */
            overflow: hidden; /* Hide the rocket when it flies out */
        }

        .auto-merge-notice-text {
            /* Text styles, no longer blinking */
            font-weight: bold;
            padding: 1rem;
            text-align: center;
            font-size: 1.5rem;
            color: green;
            position: relative; /* Ensure text is above the animation */
            z-index: 2;
        }

        .moon {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 25px;
            height: 25px;
            background-color: #f0e68c; /* Khaki-like moon color */
            border-radius: 50%;
            box-shadow: inset -5px 2px 0px 0px rgba(0,0,0,0.2);
            z-index: 1;
        }

        .rocket {
            position: absolute;
            font-size: 1.5rem;
            z-index: 1;
            animation: rocket-fly 5s linear infinite;
            animation-delay: 1s; /* Stagger the animation start */
        }
    `;

    // Append the style element to the document head
    document.head.appendChild(styleElement);
}

function checkAndAddNotice() {
    // First, ensure our blinking styles are on the page
    addBlinkingStyles();

    let autoMergeEnabled = false;

    // Check the timeline for the "enabled auto-merge" event text
    let events = document.querySelectorAll('.js-timeline-item .TimelineItem-body');
    for (let index = events.length - 1; index >= 0; index--) {
        const element = events[index];
        if (element.innerText.includes("enabled auto-merge")) {
            autoMergeEnabled = true;
            break;
        }
    }

    const mergeStatusCheck = document.querySelector('.merge-pr.Details');
    const noticeId = 'auto-merge-enabled-notice';
    const existingNotice = document.getElementById(noticeId);
    if (!autoMergeEnabled) {
        if (existingNotice) {
            existingNotice.remove();
            return
        }
        return
    }

    if (existingNotice) {
        return
    }

    const box = document.createElement('div');
    box.id = 'auto-merge-box';
    box.className = "branch-action py-0 my-3 pl-0 pl-md-3 ml-md-6";

    const noticeContainer = document.createElement('div');
    noticeContainer.className = "border color-border-default rounded-2 branch-action-item js-details-container js-transitionable blinking-corners";
    noticeContainer.id = noticeId;

    // Create animation elements
    const moon = document.createElement('div');
    moon.className = 'moon';

    const rocket = document.createElement('div');
    rocket.className = 'rocket';
    rocket.textContent = '🚀';

    // Create the element that will have the text
    const noticeElement = document.createElement('div');
    noticeElement.className = 'auto-merge-notice-text'; // Apply our new static text style
    noticeElement.textContent = 'Auto-merge enabled';

    // Add animation elements and text to the container
    noticeContainer.append(moon);
    noticeContainer.append(rocket);
    noticeContainer.append(noticeElement);

    box.append(noticeContainer);

    // Append our new message before the last element in the merge status area
    if (mergeStatusCheck && mergeStatusCheck.lastElementChild) {
        mergeStatusCheck.insertBefore(box, mergeStatusCheck.lastElementChild);
    }
}

// Create an observer instance linked to the callback function
const observer = new MutationObserver(() => { checkAndAddNotice() });
observer.observe(document.body, { childList: true, subtree: true });

checkAndAddNotice();
