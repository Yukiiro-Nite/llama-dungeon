export interface ChatMessage {
  role: 'system' | 'assistant' | 'user',
  content: string
}

export interface LLamaResponse {
  model: string,
  created_at: string,
  message: {
    role: "assistant",
    content: string
  },
  done_reason: string,
  done: boolean,
  total_duration: number,
  load_duration: number,
  prompt_eval_count: number,
  prompt_eval_duration: number,
  eval_count: number,
  eval_duration: number
}

export type GameState = Record<string, string | number>

export interface GameResponseOption {
  description: string
  stateUpdate: GameState
}

export interface GameResponse {
  scene: string
  options: GameResponseOption[]
}

export interface ResponseError {
  error?: unknown,
  reason?: string
}

export const explore = async (
  prompt: string,
  history: ChatMessage[]
): Promise<GameResponse> => {
  const systemMessage = {
    role: 'system',
    content: prompt
  }
  const recentHistory = history.slice(0, 10).reverse()
  const messages = [systemMessage].concat(recentHistory)

  let response: LLamaResponse
  try {
    response = await (await fetch(
      'http://localhost:11434/api/chat',
      {
        method: 'POST',
        body: JSON.stringify({
          model: 'llama3',
          stream: false,
          format: 'json',
          messages
        })
      }
    )).json() as unknown as LLamaResponse
  } catch (error) {
    console.error('Problem getting response from llama: ', error)
    throw {
      error,
      reason: 'llama request error'
    }
  }

  console.log('Got response: ', response)
  const content = response.message.content

  let parsedContent: GameResponse
  try {
    parsedContent = JSON.parse(content) as GameResponse
  } catch (error) {
    console.error('Problem parsing content: ', content, error)
    throw {
      error,
      reason: 'could not parse content'
    }
  }

  return parsedContent
}