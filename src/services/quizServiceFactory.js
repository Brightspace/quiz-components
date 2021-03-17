import { QuizDemoService } from './quizDemoService';
import { QuizService } from './quizService';

export class QuizServiceFactory {
	static getQuizService() {
		if (window.demo) {
			return QuizDemoService;
		}
		return QuizService;
	}
}
