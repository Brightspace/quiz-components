export class QuizTestService {
	constructor(patches) {
		this.getQuestions = async() => [];

		if (patches) {
			for (const [functionName, patch] of Object.entries(patches)) {
				this[functionName] = patch;
			}
		}
	}
}
