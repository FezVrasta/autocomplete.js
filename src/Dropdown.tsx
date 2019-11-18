/** @jsx h */

import { h } from 'preact';

import { Template } from './Template';
import {
  AutocompleteItem,
  AutocompleteState,
  AutocompleteProps,
  AutocompleteSetters,
  DropdownPosition,
} from './types';
import { convertToPreactChildren } from './utils';

interface DropdownProps extends AutocompleteState {
  position: DropdownPosition | undefined;
  hidden: boolean;
  templates: AutocompleteProps['templates'];
  onClick: AutocompleteProps['onClick'];
  transformResultsRender: AutocompleteProps['transformResultsRender'];
  setters: AutocompleteSetters;
  getItemProps(options?: object): any;
  getMenuProps(options?: object): any;
}

export const Dropdown = ({
  position,
  hidden,
  isOpen,
  isStalled,
  isLoading,
  query,
  error,
  context,
  results,
  templates,
  transformResultsRender,
  setters,
  onClick,
  getItemProps,
  getMenuProps,
}: DropdownProps) => {
  const state = {
    isOpen,
    isStalled,
    isLoading,
    query,
    error,
    context,
    results,
  };

  // Sanitize the dropdown position to only extract the number values so that
  // the style is correct.
  const positionStyle =
    position &&
    Object.keys(position).reduce<{ [key: string]: number }>((acc, current) => {
      if (typeof position[current] === 'number') {
        acc[current] = position[current];
      }

      return acc;
    }, {});

  return (
    <div
      className={[
        'algolia-autocomplete-dropdown',
        isStalled && 'algolia-autocomplete-dropdown--stalled',
        error && 'algolia-autocomplete-dropdown--errored',
      ]
        .filter(Boolean)
        .join(' ')}
      style={positionStyle}
      hidden={hidden}
    >
      <div className="algolia-autocomplete-dropdown-container">
        <Template
          tagName="header"
          data={{
            state,
            ...setters,
          }}
          template={templates.header}
          rootProps={{
            className: 'algolia-autocomplete-header',
          }}
        />

        {convertToPreactChildren(
          transformResultsRender(
            results.map((result, index) => {
              const { source, suggestions } = result;

              return (
                <section
                  key={`result-${index}`}
                  className={[
                    'algolia-autocomplete-suggestions',
                    source.classNames.root,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <Template
                    tagName="header"
                    data={{
                      state,
                      ...setters,
                    }}
                    template={source.templates.header}
                    rootProps={{
                      className: [
                        'algolia-autocomplete-suggestions-header',
                        source.classNames.header,
                      ]
                        .filter(Boolean)
                        .join(' '),
                    }}
                  />

                  {!state.isLoading && suggestions.length === 0 ? (
                    <Template
                      data={{
                        state,
                        ...setters,
                      }}
                      template={source.templates.empty}
                      rootProps={{
                        className: source.classNames.empty,
                      }}
                    />
                  ) : (
                    <ul
                      {...getMenuProps(
                        {},
                        // @TODO: remove `suppressRefError`
                        // @ts-ignore
                        // See https://github.com/downshift-js/downshift#getmenuprops
                        { suppressRefError: true }
                      )}
                      className={source.classNames.list}
                    >
                      {suggestions.map((suggestion, index) => {
                        const item: AutocompleteItem = {
                          suggestionValue: source.getInputValue({
                            suggestion,
                            state,
                          }),
                          suggestionUrl: source.getSuggestionUrl({
                            suggestion,
                            state,
                          }),
                          suggestion,
                          source,
                        };

                        return (
                          <Template
                            key={`suggestion-${index}`}
                            tagName="li"
                            rootProps={{
                              className: [
                                'algolia-autocomplete-suggestions-item',
                                source.classNames.suggestion,
                              ]
                                .filter(Boolean)
                                .join(' '),
                              ...getItemProps({
                                item,
                                tabIndex: 0,
                                onClick: (event: MouseEvent) =>
                                  onClick(event, {
                                    suggestion: item.suggestion,
                                    suggestionValue: item.suggestionValue,
                                    suggestionUrl: item.suggestionUrl,
                                    source: item.source,
                                    state,
                                    ...setters,
                                  }),
                              }),
                            }}
                            data={{
                              suggestion,
                              state,
                              ...setters,
                            }}
                            template={source.templates.suggestion}
                          />
                        );
                      })}
                    </ul>
                  )}

                  <Template
                    tagName="footer"
                    data={{
                      state,
                      ...setters,
                    }}
                    template={source.templates.footer}
                    rootProps={{
                      className: [
                        'algolia-autocomplete-suggestions-footer',
                        source.classNames.footer,
                      ]
                        .filter(Boolean)
                        .join(' '),
                    }}
                  />
                </section>
              );
            })
          )
        )}

        <Template
          tagName="footer"
          data={{
            state,
            ...setters,
          }}
          template={templates.footer}
          rootProps={{
            className: 'algolia-autocomplete-footer',
          }}
        />
      </div>
    </div>
  );
};
