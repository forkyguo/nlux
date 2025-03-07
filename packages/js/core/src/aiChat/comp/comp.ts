import {ControllerContext} from '../../types/controllerContext';
import {CompRegistry} from './registry';

export const comp = <
    CompClass extends new (context: ControllerContext<any>, props: any) => InstanceType<CompClass>,
>(
    compClass: CompClass,
) => {
    const compId = typeof compClass === 'function'
        ? (compClass as unknown as {__compId: string}).__compId
        : undefined;

    if (!compId) {
        throw new Error('Invalid compClass! Component should be registered before using');
    }

    type CompClassWithPublicConstructor = new (
        context: ControllerContext<object>,
        props: object,
    ) => InstanceType<CompClass>;

    const CompClass = CompRegistry.retrieve(compId)?.model as CompClassWithPublicConstructor | undefined;
    if (!CompClass || typeof CompClass !== 'function') {
        throw new Error(`Component "${compId}" is not registered`);
    }

    // IMPORTANT ✨ The lines below are responsible for creating all instances of all components.

    return {
        withContext: (newContext: ControllerContext<any>) => {
            return {
                create: (): InstanceType<CompClass> => {
                    return new CompClass(newContext as unknown as ControllerContext<object>, {});
                },
                withProps: <PropsType = unknown>(newProps: PropsType) => {
                    return {
                        create: (): InstanceType<CompClass> => {
                            return new CompClass(newContext as unknown as ControllerContext<object>,
                                newProps as object,
                            );
                        },
                    };
                },
            };
        },
    };
};
