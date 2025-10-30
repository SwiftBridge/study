// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract Study {
    struct Course {
        uint256 id;
        address owner;
        string title;
        string platform;
        string instructor;
        uint256 progress;
        bool completed;
        uint256 timestamp;
        bool exists;
    }

    struct Note {
        uint256 id;
        address owner;
        string title;
        string content;
        string tags;
        uint256 timestamp;
        bool exists;
    }

    struct Achievement {
        uint256 id;
        address owner;
        string title;
        string description;
        string certificateUrl;
        uint256 timestamp;
        bool exists;
    }

    struct Goal {
        uint256 id;
        address owner;
        string title;
        string description;
        uint256 targetDate;
        bool achieved;
        uint256 timestamp;
        bool exists;
    }

    // State variables
    uint256 public entryFee = 0.0000001 ether;
    address public owner;

    // Counters
    uint256 public courseCounter;
    uint256 public noteCounter;
    uint256 public achievementCounter;
    uint256 public goalCounter;

    // Mappings
    mapping(uint256 => Course) public courses;
    mapping(uint256 => Note) public notes;
    mapping(uint256 => Achievement) public achievements;
    mapping(uint256 => Goal) public goals;

    mapping(address => uint256[]) public userCourseIds;
    mapping(address => uint256[]) public userNoteIds;
    mapping(address => uint256[]) public userAchievementIds;
    mapping(address => uint256[]) public userGoalIds;

    // Events
    event CourseAdded(uint256 indexed id, address indexed owner, string title);
    event CourseUpdated(uint256 indexed id, uint256 progress, bool completed);
    event NoteAdded(uint256 indexed id, address indexed owner, string title);
    event AchievementAdded(uint256 indexed id, address indexed owner, string title);
    event GoalAdded(uint256 indexed id, address indexed owner, string title);
    event GoalAchieved(uint256 indexed id, address indexed owner);

    constructor() {
        owner = msg.sender;
    }

    // Course Functions
    function addCourse(
        string memory _title,
        string memory _platform,
        string memory _instructor,
        uint256 _progress
    ) public payable {
        require(msg.value >= entryFee, "Insufficient fee");
        require(bytes(_title).length > 0, "Title required");
        require(_progress <= 100, "Invalid progress");

        uint256 id = courseCounter++;

        courses[id] = Course({
            id: id,
            owner: msg.sender,
            title: _title,
            platform: _platform,
            instructor: _instructor,
            progress: _progress,
            completed: _progress == 100,
            timestamp: block.timestamp,
            exists: true
        });

        userCourseIds[msg.sender].push(id);
        emit CourseAdded(id, msg.sender, _title);
    }

    function updateCourseProgress(uint256 _courseId, uint256 _progress) public {
        require(courses[_courseId].exists, "Course does not exist");
        require(courses[_courseId].owner == msg.sender, "Not course owner");
        require(_progress <= 100, "Invalid progress");

        courses[_courseId].progress = _progress;
        courses[_courseId].completed = _progress == 100;
        emit CourseUpdated(_courseId, _progress, _progress == 100);
    }

    // Note Functions
    function addNote(
        string memory _title,
        string memory _content,
        string memory _tags
    ) public payable {
        require(msg.value >= entryFee, "Insufficient fee");
        require(bytes(_title).length > 0, "Title required");

        uint256 id = noteCounter++;

        notes[id] = Note({
            id: id,
            owner: msg.sender,
            title: _title,
            content: _content,
            tags: _tags,
            timestamp: block.timestamp,
            exists: true
        });

        userNoteIds[msg.sender].push(id);
        emit NoteAdded(id, msg.sender, _title);
    }

    // Achievement Functions
    function addAchievement(
        string memory _title,
        string memory _description,
        string memory _certificateUrl
    ) public payable {
        require(msg.value >= entryFee, "Insufficient fee");
        require(bytes(_title).length > 0, "Title required");

        uint256 id = achievementCounter++;

        achievements[id] = Achievement({
            id: id,
            owner: msg.sender,
            title: _title,
            description: _description,
            certificateUrl: _certificateUrl,
            timestamp: block.timestamp,
            exists: true
        });

        userAchievementIds[msg.sender].push(id);
        emit AchievementAdded(id, msg.sender, _title);
    }

    // Goal Functions
    function addGoal(
        string memory _title,
        string memory _description,
        uint256 _targetDate
    ) public payable {
        require(msg.value >= entryFee, "Insufficient fee");
        require(bytes(_title).length > 0, "Title required");

        uint256 id = goalCounter++;

        goals[id] = Goal({
            id: id,
            owner: msg.sender,
            title: _title,
            description: _description,
            targetDate: _targetDate,
            achieved: false,
            timestamp: block.timestamp,
            exists: true
        });

        userGoalIds[msg.sender].push(id);
        emit GoalAdded(id, msg.sender, _title);
    }

    function markGoalAchieved(uint256 _goalId) public {
        require(goals[_goalId].exists, "Goal does not exist");
        require(goals[_goalId].owner == msg.sender, "Not goal owner");

        goals[_goalId].achieved = true;
        emit GoalAchieved(_goalId, msg.sender);
    }

    // View Functions
    function getUserCourses(address _user) public view returns (Course[] memory) {
        uint256[] memory ids = userCourseIds[_user];
        uint256 activeCount = 0;

        for (uint256 i = 0; i < ids.length; i++) {
            if (courses[ids[i]].exists) activeCount++;
        }

        Course[] memory result = new Course[](activeCount);
        uint256 index = 0;

        for (uint256 i = 0; i < ids.length; i++) {
            if (courses[ids[i]].exists) {
                result[index] = courses[ids[i]];
                index++;
            }
        }

        return result;
    }

    function getUserNotes(address _user) public view returns (Note[] memory) {
        uint256[] memory ids = userNoteIds[_user];
        uint256 activeCount = 0;

        for (uint256 i = 0; i < ids.length; i++) {
            if (notes[ids[i]].exists) activeCount++;
        }

        Note[] memory result = new Note[](activeCount);
        uint256 index = 0;

        for (uint256 i = 0; i < ids.length; i++) {
            if (notes[ids[i]].exists) {
                result[index] = notes[ids[i]];
                index++;
            }
        }

        return result;
    }

    function getUserAchievements(address _user) public view returns (Achievement[] memory) {
        uint256[] memory ids = userAchievementIds[_user];
        uint256 activeCount = 0;

        for (uint256 i = 0; i < ids.length; i++) {
            if (achievements[ids[i]].exists) activeCount++;
        }

        Achievement[] memory result = new Achievement[](activeCount);
        uint256 index = 0;

        for (uint256 i = 0; i < ids.length; i++) {
            if (achievements[ids[i]].exists) {
                result[index] = achievements[ids[i]];
                index++;
            }
        }

        return result;
    }

    function getUserGoals(address _user) public view returns (Goal[] memory) {
        uint256[] memory ids = userGoalIds[_user];
        uint256 activeCount = 0;

        for (uint256 i = 0; i < ids.length; i++) {
            if (goals[ids[i]].exists) activeCount++;
        }

        Goal[] memory result = new Goal[](activeCount);
        uint256 index = 0;

        for (uint256 i = 0; i < ids.length; i++) {
            if (goals[ids[i]].exists) {
                result[index] = goals[ids[i]];
                index++;
            }
        }

        return result;
    }

    // Owner Functions
    function updateFee(uint256 _newFee) public {
        require(msg.sender == owner, "Only owner");
        entryFee = _newFee;
    }

    function withdraw() public {
        require(msg.sender == owner, "Only owner");
        payable(owner).transfer(address(this).balance);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
