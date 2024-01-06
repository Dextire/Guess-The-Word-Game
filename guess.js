// setting game name

let GameName = "Guess The Word";
document.title = GameName;
document.querySelector("h1").innerHTML = GameName;
document.querySelector("footer").innerHTML = `${GameName} Game created by Dextire`;

// setting game options

let NumberOfTrials = 6;
let NumberOfLetters = 6;
let CurrentTrial = 1;
let NumberOfHints = 3;

// manage words

let WordToGuess = "";
const Words = ["Create", "Update", "Delete", "Master", "Branch", "Mainly", "Elzero", "School", "Banana", "KitKat", "Monira", "Elsayd", "Cookie", "Attach"];
WordToGuess = Words[Math.floor(Math.random() * Words.length)].toLowerCase();
let MessageArea = document.querySelector(".message");

// manage hints

document.querySelector(".hint span").innerHTML = NumberOfHints;
const HintButton = document.querySelector(".hint");
HintButton.addEventListener("click", HandleHint);

function GenerateInputs()
{
    const InputsContainer = document.querySelector(".inputs");

    // create main Try div

    for (let i = 1; i <= NumberOfTrials; i++)
    {
        const TryDiv = document.createElement("div");
        TryDiv.classList.add(`try-${i}`);
        TryDiv.innerHTML = `<span>Try ${i}</span>`;

        if (i !== 1)
        {
            TryDiv.classList.add(`disabled-inputs`);
        }

        // create Inputs

        for (let j = 1; j <= NumberOfLetters; j++)
        {
            const Input = document.createElement("input");
            Input.type = "text";
            Input.id = `guess-${i}-letter-${j}`;
            Input.setAttribute("maxlength", "1");
            TryDiv.appendChild(Input);
        }

        InputsContainer.appendChild(TryDiv);
    }
    InputsContainer.children[0].children[1].focus();

    //disable all inputs except the first one

    const InputsInDisabledDiv = document.querySelectorAll(".disabled-inputs input");
    InputsInDisabledDiv.forEach((input) => (input.disabled = true));

    const Inputs = document.querySelectorAll("input");
    Inputs.forEach((input, index) =>
    {
        // convert inputs to uppercase

        input.addEventListener("input", function ()
        {
            this.value = this.value.toUpperCase();
            const NextInput = Inputs[index + 1];
            if (NextInput)
            {
                NextInput.focus();
            }
        })

        input.addEventListener("keydown", function (event)
        {
            const CurrentIndex = Array.from(Inputs).indexOf(this);

            if (event.key === "ArrowRight")
            {
                const NextInput = CurrentIndex + 1;
                if (NextInput < Inputs.length)
                {
                    Inputs[NextInput].focus();
                }
            }
            if (event.key === "ArrowLeft")
            {
                const PreviousInput = CurrentIndex - 1;
                if (PreviousInput >= 0)
                {
                    Inputs[PreviousInput].focus();
                }
            }
        })
    })
}

const GuessButton = document.querySelector(".check");
GuessButton.addEventListener("click", HandelGuesses);

function HandelGuesses()
{
    let SuccessGuess = true;
    for (let i = 1; i <= NumberOfLetters; i++)
    {
        const InputField = document.querySelector(`#guess-${CurrentTrial}-letter-${i}`);
        const Letter = InputField.value.toLowerCase();
        const ActualLetter = WordToGuess[i - 1];

        // game logic

        if (Letter === ActualLetter)
        {
            InputField.classList.add("yes-in-place");
        }
        else if (WordToGuess.includes(Letter) && Letter !== "")
        {
            InputField.classList.add("not-in-place");
            SuccessGuess = false;
        }
        else
        {
            InputField.classList.add("no");
            SuccessGuess = false;
        }
    }

    // check if user win or lose

    if (SuccessGuess)
    {
        MessageArea.innerHTML = `You WIN, the word is <span>${WordToGuess}</span>`;
        if (NumberOfHints === 3)
        {
            MessageArea.innerHTML += `<p>Congratulations you didn't use any HINTS</p>`;
        }
        let AllTries = document.querySelectorAll(".inputs > div");
        AllTries.forEach((TryDiv) => TryDiv.classList.add("disabled-inputs"));
        GuessButton.disabled = true;
        HintButton.disabled = true;
    }
    else
    {
        document.querySelector(`.try-${CurrentTrial}`).classList.add("disabled-inputs");
        const CurrentTrialInputs = document.querySelectorAll(`.try-${CurrentTrial} input`);
        CurrentTrialInputs.forEach((Input) => { Input.disabled = true });
        CurrentTrial++;
        const NextTrialInputs = document.querySelectorAll(`.try-${CurrentTrial} input`);
        NextTrialInputs.forEach((Input) => { Input.disabled = false });

        let El = document.querySelector(`.try-${CurrentTrial}`);
        if (El)
        {
            document.querySelector(`.try-${CurrentTrial}`).classList.remove("disabled-inputs");
            El.children[1].focus();
        }
        else
        {
            GuessButton.disabled = true;
            HintButton.disabled = true;
            MessageArea.innerHTML = `You LOSE, the word is <span>${WordToGuess}</span>`;
        }
    }
}

function HandleHint()
{
    if (NumberOfHints > 0)
    {
        NumberOfHints--;
        document.querySelector(".hint span").innerHTML = NumberOfHints;
    }
    if (NumberOfHints === 0)
    {
        HintButton.disabled = true;
    }
    const EnabledInputs = document.querySelectorAll("input:not([disabled])");
    const EmptyEnabledInputs = Array.from(EnabledInputs).filter((Input) => Input.value === "");
    if (EmptyEnabledInputs.length > 0)
    {
        const RandomIndex = Math.floor(Math.random() * EmptyEnabledInputs.length);
        const RandomInput = EmptyEnabledInputs[RandomIndex];
        const IndexToFill = Array.from(EnabledInputs).indexOf(RandomInput);
        if (IndexToFill !== -1)
        {
            RandomInput.value = WordToGuess[IndexToFill].toUpperCase();
        }
    }
}

function HandleBackspace(event)
{
    if (event.key === "Backspace")
    {
        const Inputs = document.querySelectorAll("input:not([disabled])");
        const CurrentIndex = Array.from(Inputs).indexOf(document.activeElement);
        if (CurrentIndex > 0)
        {
            const CurrentInput = Inputs[CurrentIndex];
            const PreviousInput = Inputs[CurrentIndex - 1];
            CurrentInput.value = "";
            PreviousInput.value = "";
            PreviousInput.focus();
        }
    }
}

document.addEventListener("keydown", HandleBackspace);

window.onload = function ()
{
    GenerateInputs();
};