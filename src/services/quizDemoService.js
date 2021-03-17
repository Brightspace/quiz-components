export class QuizDemoService {
	static async getQuestions() {
		return await fetch('../../data/questions.json').then(response => response.json());
	}

	static async updateQuestionPoints(questions) {
		console.log('Updating points');
		console.log(questions);
	}
}
