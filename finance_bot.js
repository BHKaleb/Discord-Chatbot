// Create a new Discord client
const Discord = require('discord.js')
const client =  new Discord.Client()

// List of variables needed to calculate a student's finances
let commands = ["'!start', '!change'"]
let department
let tuition = 0
let totalCost = 0
let scholarships = 0
let fees = 0
let housing = ""
let housingCost = 0
let courses = []

// Start chatbot when connceted to Discord channel
client.on('ready', () => {
    console.log("Connected as " + client.user.tag)

    // Collect channel IDs of all channels
    client.guilds.cache.forEach((guild) => {
        console.log(guild.name)
        guild.channels.cache.forEach((channel) => {
            console.log(` - ${channel.name} ${channel.type} ${channel.id}`)
        })
    })

    let botTestingChannel = client.channels.cache.get("780511244087066654")
    botTestingChannel.send("Hello chat! Let me know if you need anything!")
})

// Retrieval based answers when user messages the chatbot
client.on('message', (receivedMessage) => {
    // Bot won't respond to its own messages
    if (receivedMessage.author == client.user) {
        return
    }

    // Starts the processCommand function
    if (receivedMessage.content.startsWith("!")) {
        processCommand(receivedMessage)
    }

    if (receivedMessage.content.includes("Morning") || receivedMessage.content.includes("morning")) {
        receivedMessage.channel.send("Good morning, " + receivedMessage.author.toString() + "! How are you?")
    }

    if (receivedMessage.content.startsWith("Hello") || receivedMessage.content.startsWith("Hi") || receivedMessage.content.startsWith("Hey")) {
        receivedMessage.channel.send("Hey! How's it going, " + receivedMessage.author.toString() + "?")
    }

    if (receivedMessage.content.includes("love it") || receivedMessage.content.includes("loving it") || receivedMessage.content.includes("like it") || receivedMessage.content.includes("liking it")) {
        receivedMessage.channel.send("I'm so glad to hear that!")
    }

    // Finds the housing cost of the user
    if (receivedMessage.content.includes("live") || receivedMessage.content.includes("housing") || receivedMessage.content.includes("living")) {
        if (receivedMessage.content.includes("on")) {
            housing = "on"
            housingCost = 4820
            receivedMessage.channel.send("Oh, you live on campus? Okay!")
        }

        else if (receivedMessage.content.includes("off")) {
            housing = "off"
            receivedMessage.channel.send("Didn't want to live on campus? Understandable!")
        }
    }

    if (receivedMessage.content.includes("CS") || receivedMessage.content.includes("Computer Science") || receivedMessage.content.includes("cs")) {
        department = "CS"
        //console.log(department)
        receivedMessage.channel.send("Oh, you're majoring in Computer Science, awesome! How are you liking it?")
        if (tuition == 0) {
            receivedMessage.channel.send("How many credit hours are you taking?")
        }
    }

    // Calculates the tutiton and fees of the user
    if (parseInt(receivedMessage.content) > 0 && parseInt(receivedMessage.content) < 22) {
        tuition = tuition + (parseInt(receivedMessage.content) * 218)
        fees = fees + (parseInt(receivedMessage.content) * 82)
        totalCost = tuition + fees
        //console.log(tuition)
        receivedMessage.channel.send("Now, what classes are you taking?")
        //receivedMessage.channel.send("Your current semester tuition cost is $" + tuition.toString() + "!")
    }

    if (receivedMessage.content.includes("I'm taking") || receivedMessage.content.includes("i'm taking") || receivedMessage.content.includes("Im taking") || receivedMessage.content.includes("im taking")) {
        let trimmed = receivedMessage.content.substr(11)
        courses.push(trimmed)
        //console.log(courses) 
        receivedMessage.channel.send("And one last thing for me! Are you living on campus?")
    }

    // Allows the user to find out how much they owe
    if (receivedMessage.content.includes("How") || receivedMessage.content.includes("how")) {
        if (receivedMessage.content.includes("doing")) {
            receivedMessage.channel.send("I'm doing great! How about you?")
        }

        else if (receivedMessage.content.includes("college") || receivedMessage.content.includes("pay")) {
            receivedMessage.channel.send("College debt can be tricky to deal with. Scholarships are a good way to pay for college, do you have any?")
        }

        else if (receivedMessage.content.includes("owe")) {
            receivedMessage.channel.send("You owe $" + totalCost.toString() + ", " + receivedMessage.author.toString() + "!")
        }

        else if (receivedMessage.content.includes("owe") && receivedMessage.content.includes("scholarships")) {
            receivedMessage.channel.send("You owe $" + withScholarships.toString() + " after scholarships, " + receivedMessage.author.toString() + "!")
        }

        else if (receivedMessage.content.includes("much")) {
            if (receivedMessage.content.includes("debt")) {
                receivedMessage.channel.send("You're $" + totalCost.toString() + " in debt, " + receivedMessage.author.toString() + "!")
            }
            
            // Tells suer how much they have in scholarships
            else if (receivedMessage.content.includes("scholarships") ||receivedMessage.content.includes("scholarship")) {
                receivedMessage.channel.send("You have $" + scholarships.toString() + " in scholarships, " + receivedMessage.author.toString() + "!")
            }
        }
    }

    // Gets the scholarships amount of the user
    if (parseInt(receivedMessage.content) > 0 && parseInt(receivedMessage.content) > 100) {
        scholarships = scholarships + parseInt(receivedMessage.content)
        //console.log(scholarships)
        if (scholarships >= totalCost) {
            receivedMessage.channel.send("That completely covers your tuition, no need to worry about paying now!")
        }

        else if (scholarships < totalCost) {
            receivedMessage.channel.send("Not enough to fully cover your costs but it helps!")
        }
    }

    // Allows user to add scholrships and housing to their total college cost
    if (receivedMessage.content.includes("can you") || receivedMessage.content.includes("Can you")) {
        if (receivedMessage.content.includes("add") && receivedMessage.content.includes("scholarships")) {
            totalCost = totalCost - scholarships
            receivedMessage.channel.send("Sure thing!")
        }

        else if (receivedMessage.content.includes("add") && receivedMessage.content.includes("housing")) {
            if (housing == "on") {
                totalCost = totalCost + housingCost
                receivedMessage.channel.send("I gotcha!")
            }

            else if (housing == "off") {
                receivedMessage.channel.send("I can't add that for you since I don't know how much that costs!")
            }
        }
    }

    // Allows user to change major and/or classes
    if (receivedMessage.content.includes("I want") || receivedMessage.content.includes("i want")) {
        if (receivedMessage.content.includes("change") || receivedMessage.content.includes("switch")) {
            receivedMessage.channel.send("Why are you wanting to do that?")
        }

        else if (receivedMessage.content.includes("classes") || receivedMessage.content.includes("class") || receivedMessage.content.includes("courses") || receivedMessage.content.includes("course")) {
            receivedMessage.channel.send("To register for a new course you need to contact your advisor!")
            if (department == 'CS') {
                receivedMessage.channel.send("Contact the chair of your department, Dr. Jake Qualls, at jqualls@astate.edu to find who your advisor is!")
            }
            else {
                receivedMessage.channel.send("What's your department? I can find the chair of your department so you can get more information about adding and dropping classes!")
            }
        }
    }

    if (receivedMessage.content.includes("difficulty") || receivedMessage.content.includes("hard")) {
        receivedMessage.channel.send("I'm sorry you're having a hard time... Have you considered tutoring?")
    }

    // Finds the chair of the user's department
    if (receivedMessage.content.includes("tutor") || receivedMessage.content.includes("tutoring")) {
        receivedMessage.channel.send("Well, if it's not working then I can help you change your major!")
        if (department == 'CS') {
            receivedMessage.channel.send("Contact the chair of your department, Dr. Jake Qualls, at jqualls@astate.edu to find out what you need to do!")
        }
        else {
            receivedMessage.channel.send("What's your department? I can find the chair of your department so you can get more information about switching majors!")
        }
    }

    if (receivedMessage.content.includes("good")) {
        receivedMessage.channel.send("Fantastic! Good to hear!")
        receivedMessage.channel.send("Let me know if you need help with anything!")
    }

    if (receivedMessage.content.includes("I have") || receivedMessage.content.includes("i have")) {
        if (receivedMessage.content.includes("scholarships")) {
            receivedMessage.channel.send("Fantastic! How much do you have in scholarships?")
        }
    }

    if (receivedMessage.content.includes("What") || receivedMessage.content.includes("what")) {
        if (receivedMessage.content.includes("classes") || receivedMessage.content.includes("courses")) {
            receivedMessage.channel.send("You're taking " + courses + "," + receivedMessage.author.toString() + "!")
        }
    }

    if (receivedMessage.content.includes("I don't") || receivedMessage.content.includes("i don't") || receivedMessage.content.includes("I dont") || receivedMessage.content.includes("i dont")) {
        if (receivedMessage.content.includes("like") && receivedMessage.content.includes("course") || receivedMessage.content.includes("like") && receivedMessage.content.includes("class")) {
            receivedMessage.channel.send("I'm sorry you don't like your classes! What are you wanting to do?")
        }

        else if (receivedMessage.content.includes("like") && receivedMessage.content.includes("major") || receivedMessage.content.includes("like") && receivedMessage.content.includes("department")) {
            receivedMessage.channel.send("I'm sorry you don't like your major! What are you wanting to do?")
        }
    }

})

// Processes the !start and !change commands
function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1)
    let splitCommand = fullCommand.split(" ")
    let primaryCommand = splitCommand[0]
    let arguments = splitCommand.slice(1)

    // Searches for certain commands
    if (primaryCommand == "commands") {
        allCommands(receivedMessage)
    } else if (primaryCommand == "start") {
        getStartedCommand(receivedMessage)
    } else if (primaryCommand == "change") {
        changeCommand(receivedMessage)
    } else {
        receivedMessage.channel.send("Unknown command. Try `!commands` for a list of commands!")
    }
}

// Gets a list of the current commands
function allCommands(receivedMessage) {
    receivedMessage.channel.send("Here is a list of commands: " + commands)
}

// Starts the process to calculate the user's total college cost
function getStartedCommand(receivedMessage) {
    receivedMessage.channel.send("Let's get started, " + receivedMessage.author.toString() + "!")
    receivedMessage.channel.send("What department are you in?")
}

// Allows user to change their major
function changeCommand(receivedMessage) {
    receivedMessage.channel.send("You're changing your major?! Let's start all over!")
    totalCost = 0
    department = ""
}

// Log in as Finance Bot
client.login("NzgwNDgxNDcxODQ4Nzc1NzAw.X7vuAw.Ov7LYto-fRl3XxHKbsvWB374fpY")