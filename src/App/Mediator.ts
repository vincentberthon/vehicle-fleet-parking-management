type Handler<TCommand, TResult> = (command: TCommand) => TResult;

export class Mediator {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private handlers = new Map<string, Handler<any, any>>();

  register<TCommand, TResult>(commandName: string, handler: Handler<TCommand, TResult>) {
    this.handlers.set(commandName, handler);
  }

  send<TCommand, TResult>(commandName: string, command: TCommand): TResult {
    const handler = this.handlers.get(commandName);
    if (!handler) throw new Error(`No handler found for ${commandName}`);
    return handler(command);
  }
}
