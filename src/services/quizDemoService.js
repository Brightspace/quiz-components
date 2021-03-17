function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export class QuizDemoService {
	static async getQuestions() {
		await sleep(0);

		return await fetch('../../data/questions.json').then(response => response.json());
	}

	static async updateQuestionPoints(questions) {
		console.log('Updating points');
		console.log(questions);
	}
}
