function Card(props) {
	const color = (props.suit === 'heart' || props.suit === 'diamond') ?
		'danger' : 'black';

	const suits = {
		heart: 'Hearts',
		diamond: 'Diamonds',
		spade: 'Spades',
		club: 'Clubs'
	};

	return (
		<div className="col-auto mb-3">
			<div className={`card text-${color} card-size`}>
				<div className="card-header text-start">
					<u>{props.abrev}</u>&nbsp;
					<i className={`bi bi-suit-${props.suit}-fill`}></i>
				</div>
				<div className="card-body text-center">
					<h3>{props.name} of {suits[props.suit]}</h3>
				</div>
				<div className="card-footer text-end">
					<i className={`bi bi-suit-${props.suit}-fill`}></i>
					&nbsp;<u>{props.abrev}</u>
				</div>
			</div>
		</div>
	);
}


function shuffleArray(arr, x) {
	// shuffle array x times, in place
	const randomize = () => Math.random() - 0.5;
	for (let i = 1; i <= x; i++) {
		arr.sort(randomize)
	}
}

function CardDeck() {
	const [cards, setCards] = React.useState([]);

	React.useEffect(() => {
		fetch('/api/cards.json')
			.then((response) => response.json())
			.then((cardsArr) => {
				setCards(cardsArr);
			})
	}, []);

	{/* add a handler function for the shuffle button here */}
	function handleShuffle() {
		shuffleArray(cards, 3);

		{/* for state to update correctly, it must be passed a copy */}
		setCards([...cards]);
	}

	const cardComponents = cards.length === 0 ?
		(<p><span className="spinner-border"/> Loading...</p>) :
		(cards.map((card) => {
			return (
				<Card
					suit={card.suit}
					name={card.name}
					abrev={card.abrev}
					value={card.value}
					key={card.abrev + '-' + card.suit}
				/>
			);
		}));

	return (
		<div className="row">
			<div className="col border rounded py-2">
				
				{/* add a button here to shuffle the deck */}
				<button
					className="btn btn-warning mb-1"
					type="button"
					onClick={handleShuffle}
				>
					Shuffle the deck
				</button>

				<h2>Card components:</h2>
				<div className="row mt-4">{cardComponents}</div>
			</div>
		</div>
	);
}


function getRandomNum(max) {
	// get a random number between 1 and max, inclusive
	return Math.ceil(Math.random() * max);
}

function Die(props) {
	const [dieValue, setDieValue] = React.useState('?');

	function roll() {
		const rollResult = getRandomNum(props.sides);
		setDieValue(rollResult);
	}

	return (
		<button
			className="btn btn-success me-2 mb-2 px-4 square"
			type="button"
			onClick={roll}
		>
			<p>d{props.sides}</p>
			<h2>{dieValue}</h2>
		</button>
	);
}


function ClickCounter(props) {
	const [currentCount, setCurrentCount] = React.useState(props.initialCount);

	function incrementCount() {
		setCurrentCount((current) => current + 1);
	}

	return (
		<div className="col-auto border rounded mb-2 me-2 py-2">
			<h2>{currentCount}</h2>
			<button
				className="btn btn-primary"
				type="button"
				onClick={incrementCount}
			>
				<i className="bi bi-hand-index-thumb"></i>
				&nbsp;Click me to increase the count
			</button>
		</div>
	);
}


function App() {
	const firstCounter = [<ClickCounter initialCount={0} key="0"/>];
	const [clickCounters, setClickCounters] = React.useState(firstCounter);
	const [numValue, setNumValue] = React.useState(0)

	const [sides, setSides] = React.useState(6); {/* add sides to state */}
	const startingSides = [4, 6, 8, 10, 12, 20];
	const startingDice = startingSides.map((num, idx) => {
		return <Die sides={num} key={`d${idx}`} />
	});
	const [dice, setDice] = React.useState(startingDice); {/* add dice to state */}

	{/* add handler functions for the ClickCounter form here */}
	function handleNumChange(evt) {
		setNumValue(Number(evt.target.value));
	}
	function handleClickForm(evt) {
		evt.preventDefault();
		setClickCounters((current) => {
			return [
				...current,
				<ClickCounter initialCount={numValue} key={current.length} />
			];
		});
	}

	{/* add handlers for the Die form here */}
	function handleSidesChange(evt) {
		setSides(Number(evt.target.value));
	}
	function handleDieForm(evt) {
		evt.preventDefault();
		setDice((cur) => {
			return [...cur, <Die sides={sides} key={`d${cur.length}`}/>]
		});
	}

	return (
		<>
			<h1>ClickCounter components:</h1>

			{/* add a form that adds new counters with user input for
				initialCount */}
			<form onSubmit={handleClickForm}>
				<div className="input-group mb-2">
					<input
						className="form-control"
						type="number"
						value={numValue}
						onChange={handleNumChange} />
					<button
						className="btn btn-warning"
						type="submit"
					>
						Add another counter @ {numValue}
					</button>
				</div>
			</form>
			<div className="row mb-5">
				{clickCounters}
			</div>

			<h1>Die components:</h1>
			<div className="row mb-5">

				{/* add a form that adds new dice of different sizes */}
				<form onSubmit={handleDieForm}>
					<div className="input-group mb-2">
						<button
							className="btn btn-warning"
							type="submit"
						>
							Add a new d...
						</button>
						<select
							className="form-control"
							value={sides}
							onChange={handleSidesChange}
						>
							<option value="4">4</option>
							<option value="6">6</option>
							<option value="8">8</option>
							<option value="10">10</option>
							<option value="12">12</option>
							<option value="20">20</option>
						</select>
					</div>
				</form>

				<div className="col border rounded py-2">
					{dice}
				</div>
			</div>

			<h1>CardDeck component:</h1>
			<CardDeck />
		</>
	);
}


ReactDOM.render(<App />, document.getElementById('root'));
